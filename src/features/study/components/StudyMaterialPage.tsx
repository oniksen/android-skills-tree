import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StudyMaterialPage({
  backHref,
  backLabel = "Назад",
  children,
}: {
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="study-page">
      <div className="study-topbar">
        <Link href={backHref} className="study-back">
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
      <article className="study-article">{children}</article>
    </div>
  );
}
