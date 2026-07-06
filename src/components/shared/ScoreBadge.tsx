export default function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "text-xs px-2 py-0.5", md: "text-sm px-3 py-1", lg: "text-lg px-4 py-1.5" };
  return (
    <span className={`inline-flex items-center font-semibold rounded-full bg-blue-900/50 text-blue-300 border border-blue-800/50 ${sizeClasses[size]}`}>
      {score}
    </span>
  );
}
