"use client";

import { useEffect, useRef, useState } from "react";
import { gradeAnswer } from "@/features/quiz/actions/grade-answer";
import { juniorProgrammingBasicsQuestions } from "@/data/quiz-questions";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAssessments } from "@/hooks/useAssessments";
import { useRouter } from "next/navigation";

type ChatMessage = {
  id: number;
  role: "system" | "user" | "assistant";
  text: string;
  score?: number;
  reason?: string;
};

export default function QuizConsole() {
  const [question, setQuestion] = useState(
    () => juniorProgrammingBasicsQuestions[Math.floor(Math.random() * juniorProgrammingBasicsQuestions.length)],
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, role: "system", text: question.question },
  ]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [limits, setLimits] = useState("");

  const router = useRouter();
  const { settings, loading: settingsLoading, getTodayCount, incrementDailyCount } = useUserSettings();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const savedKey = settings?.groqApiKey;
  const savedLast4 = settings?.groqKeyLast4;
  const limit = settings?.maxDailyQuestions ?? 5;
  const used = getTodayCount();
  const limitReached = !settingsLoading && used >= limit;

  const hasCompletedSubtopic = Object.values(assessmentMap).some((a) =>
    a?.subtopics ? Object.values(a.subtopics).some(Boolean) : false,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    const maxHeight = (el.parentElement?.parentElement?.clientHeight ?? window.innerHeight) * 0.75;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [input]);

  async function handleSend() {
    if (status !== "idle" || !input.trim() || limitReached) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: userText }]);
    setInput("");
    setStatus("sending");
    setError(null);
    try {
      const r = await gradeAnswer({
        question: question.question,
        rubric: question.rubric,
        answer: userText,
        apiKey: savedKey || apiKey || undefined,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `score: ${r.percentile}%`,
          score: r.percentile,
          reason: r.reason || "ок",
        },
      ]);
      setStatus("done");
      setLimits(r.limits);
      await incrementDailyCount();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("idle");
    }
  }

  function handleNewQuestion() {
    const next =
      juniorProgrammingBasicsQuestions[Math.floor(Math.random() * juniorProgrammingBasicsQuestions.length)];
    setQuestion(next);
    setMessages([{ id: Date.now(), role: "system", text: next.question }]);
    setInput("");
    setStatus("idle");
    setError(null);
  }

  const scoreClass = (score: number | undefined) =>
    score === undefined
      ? "text-slate-300"
      : score >= 70
        ? "text-green-400"
        : score >= 40
          ? "text-amber-400"
          : "text-red-400";

  if (assessmentsLoading || settingsLoading) {
    return <div className="term-panel rounded-lg p-8 text-center font-mono text-sm text-slate-400">loading...</div>;
  }

  if (!hasCompletedSubtopic) {
    return (
      <div className="term-panel rounded-lg p-8 text-center font-mono text-sm text-slate-400">
        Нужно пройти хотя бы одну подтему, чтобы использовать проверку.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col font-mono text-sm">
      <div className="flex items-center justify-between px-4 pt-3 text-[10px] text-slate-500">
        <button
          type="button"
          onClick={() => router.push("/tree/junior")}
          className="min-h-[32px] cursor-pointer text-blue-600 transition-colors hover:text-blue-500"
        >
          [exit]
        </button>
        <span>сегодня: {used}/{limit}</span>
      </div>
      <div ref={scrollRef} className="flex flex-1 flex-col justify-end space-y-2 overflow-y-auto px-4 py-3">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap break-words">
            {m.role === "system" && <span className="text-slate-300">{m.text}</span>}
            {m.role === "user" && (
              <span className="text-slate-200">
                <span className="text-blue-600">&gt; </span>
                {m.text}
              </span>
            )}
            {m.role === "assistant" && (
              <div className="space-y-1">
                <span className={`font-semibold ${scoreClass(m.score)}`}>{m.text}</span>
                {m.reason && <p className="pl-2 text-xs text-slate-400">{m.reason}</p>}
              </div>
            )}
          </div>
        ))}
        {status === "sending" && <div className="text-slate-500">... thinking</div>}
        {limitReached && <div className="text-xs text-red-400">! limit reached: {used}/{limit}</div>}
        {error && <div className="text-xs text-red-400">! {error}</div>}
      </div>

        <div className="mx-4 mb-3 mt-3 rounded-lg border border-slate-700/70 bg-slate-900/40 p-3">
        {savedKey ? (
          <div className="mb-2 text-xs text-slate-500">key: ...{savedLast4}</div>
        ) : (
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mb-2 w-full min-w-0 rounded-md border border-slate-700/70 bg-transparent px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
            placeholder="groq api key (optional)"
          />
        )}
        <div className="flex min-w-0 items-end gap-2">
          <span className="select-none py-0.5 leading-6 text-blue-600">&gt;</span>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== "idle" || limitReached}
            rows={1}
            className="max-h-[75%] min-w-0 w-full resize-none overflow-x-hidden overflow-y-hidden bg-transparent px-2 py-0.5 leading-6 text-slate-200 focus:outline-none disabled:opacity-60"
            placeholder="ваш ответ"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={status !== "idle" || !input.trim() || limitReached}
            className="min-h-[32px] cursor-pointer px-2 py-0.5 text-blue-600 transition-colors hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            [send]
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] text-[10px] text-slate-500">
        {limits && <span className="break-all">{limits}</span>}
        {status === "done" && !limitReached && (
          <button
            type="button"
            onClick={handleNewQuestion}
            className="min-h-[32px] cursor-pointer text-blue-600 transition-colors hover:text-blue-500"
          >
            [new]
          </button>
        )}
      </div>
    </div>
  );
}