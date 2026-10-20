"use server";

import { serverEnv } from "@/adapters/env/server";

interface GradeInput {
  question: string;
  rubric: string;
  answer: string;
  apiKey?: string;
}

export async function gradeAnswer(input: GradeInput): Promise<{ percentile: number; reason: string; raw: string; limits: string }> {
  const key = input.apiKey?.trim() || serverEnv.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set. Add it to .env.local or pass via UI.");
  }

  const prompt = [
    "Оцени ответ от 0 до 100. Верни ровно две строки:",
    "SCORE: <число 0-100>",
    "REASON: <кратко, что не так или 'ок'>",
    `Вопрос: ${input.question}`,
    `Ответ: ${input.answer}`,
  ].join("\n");

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
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 256,
        reasoning_effort: "low",
        include_reasoning: false,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        choices?: { message?: { content?: string | null; reasoning?: string | null; reasoning_content?: string | null } }[];
      };
      const msg = data.choices?.[0]?.message;
      const raw = (msg?.content || msg?.reasoning || msg?.reasoning_content || "").trim();
      const scoreMatch = raw.match(/SCORE:\s*(\d{1,3})/i);
      const reasonMatch = raw.match(/REASON:\s*(.+)/i);
      const fallbackNum = raw.match(/\d{1,3}/g);
      const n = scoreMatch
        ? Math.min(100, Math.max(0, Number(scoreMatch[1])))
        : fallbackNum && fallbackNum.length
          ? Math.min(100, Math.max(0, Number(fallbackNum[fallbackNum.length - 1])))
          : 0;
      const reason = reasonMatch ? reasonMatch[1].trim() : "";
      const limits = [
        `req ${res.headers.get("x-ratelimit-remaining-requests") ?? "?"}/${res.headers.get("x-ratelimit-limit-requests") ?? "?"}`,
        `tokens ${res.headers.get("x-ratelimit-remaining-tokens") ?? "?"}/${res.headers.get("x-ratelimit-limit-tokens") ?? "?"}`,
        `reset ${res.headers.get("x-ratelimit-reset-requests") ?? "?"}`,
      ].join(" · ");
      return { percentile: n, reason, raw, limits };
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
