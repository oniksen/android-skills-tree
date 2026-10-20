import { redirect } from "next/navigation";
import { getCurrentUser } from "@/adapters/auth/session";
import QuizConsole from "@/features/quiz/components/QuizConsole";

export default async function QuizPage() {
  const uid = await getCurrentUser();
  if (!uid) redirect("/login");

  return <QuizConsole />;
}