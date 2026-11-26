import { blockClass } from "../model/study-blocks";
import ScrollToTopButton from "@/shared/ui/ScrollToTopButton";

export default function StudyMaterialPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={blockClass("page")}>
      <article className={blockClass("article")}>{children}</article>
      <ScrollToTopButton />
    </div>
  );
}
