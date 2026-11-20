import { blockClass } from "../model/study-blocks";
import StudyBackButton from "./StudyBackButton";

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
    <div className={blockClass("page")}>
      <StudyBackButton href={backHref} label={backLabel} />
      <article className={blockClass("article")}>{children}</article>
    </div>
  );
}
