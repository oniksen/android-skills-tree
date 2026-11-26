"use server";

import { serverEnv } from "@/adapters/env/server";

interface InterviewInput {
  question: string;
  rubric?: string;
  history?: { role: "user" | "assistant"; text: string }[];
  answer?: string;
  apiKey?: string;
}

export async function interviewTurn(input: InterviewInput): Promise<{
  reply: string;
  score?: number;
  done: boolean;
  limits: string;
}> {
  const key = input.apiKey?.trim() || serverEnv.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set. Add it to .env.local or pass via UI.");
  }

  const messages: { role: string; content: string }[] = [
    {
      role: "system",
      content: [
        "Ты технический интервьюер по Android/Kotlin.",
        "Задай один вопрос, оцени ответ кандидата от 0 до 100 и дай краткий фидбек.",
        "Если рубрика передана, используй её как критерии оценки.",
        "Верни ответ в формате:",
        "SCORE: <число 0-100>",
        "REASON: <кратко>",
        "REPLY: <текст для кандидата>",
      ].join("\n"),
    },
    { role: "user", content: `Вопрос: ${input.question}` },
  ];

  if (input.rubric) {
    messages.push({ role: "system", content: `Рубрика: ${input.rubric}` });
  }

  for (const m of input.history ?? []) {
    messages.push({ role: m.role, content: m.text });
  }

  if (input.answer?.trim()) {
    messages.push({ role: "user", content: input.answer.trim() });
  }

  const models = Array.from(
    new Set([serverEnv.GROQ_MODEL || "openai/gpt-oss-120b", "openai/gpt-oss-20b"]),
  );

  let lastError: Error | null = null;
  for (const model of models) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0,
        max_tokens: 512,
        reasoning_effort: "low",
        include_reasoning: false,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        choices?: { message?: { content?: string | null } }[];
      };
      const raw = (data.choices?.[0]?.message?.content || "").trim();
      const scoreMatch = raw.match(/SCORE:\s*(\d{1,3})/i);
      const replyMatch = raw.match(/REPLY:\s*([\s\S]*)/i);
      const score = scoreMatch ? Math.min(100, Math.max(0, Number(scoreMatch[1]))) : undefined;
      const reply = replyMatch ? replyMatch[1].trim() : raw;
      const limits = [
        `req ${res.headers.get("x-ratelimit-remaining-requests") ?? "?"}/${res.headers.get("x-ratelimit-limit-requests") ?? "?"}`,
      ].join(" · ");
      return { reply, score, done: true, limits };
    }

    const text = await res.text();
    if (res.status === 404) {
      lastError = new Error(`Groq model ${model} not found: ${text}`);
      continue;
    }
    throw new Error(`Groq error ${res.status}: ${text}`);
  }

  throw lastError ?? new Error("Groq request failed");
}