export default function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "text-xs px-2 py-0.5", md: "text-sm px-2.5 py-1", lg: "text-base px-3 py-1.5" };
  return (
    <span className={`inline-flex items-center font-mono font-semibold rounded-md border border-blue-500/40 bg-blue-500/10 text-blue-600 ${sizeClasses[size]}`}>
      {score}
    </span>
  );
}
