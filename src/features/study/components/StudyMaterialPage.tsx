import { blockClass } from "../model/study-blocks";

export default function StudyMaterialPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={blockClass("page")}>
      <article className={blockClass("article")}>{children}</article>
    </div>
  );
}
