import QuizConsole from "@/features/quiz/components/QuizConsole";

// Auth is enforced by proxy.ts, so this page can stay static and be prefetched.
export default function QuizPage() {
  return <QuizConsole />;
}
