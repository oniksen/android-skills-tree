"use client";

import { memo } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudyQaItem } from "../model/parse-study-document";
import StudyInline from "./StudyInline";
import StudyProse from "./StudyProse";

const QA = blockClass("qa");
const ITEM = blockClass("qaItem");
const QUESTION = blockClass("qaQuestion");
const ANSWER = blockClass("qaAnswer");

/**
 * Interview questions from a `:::qa` directive.
 *
 * Native `<details>` keeps answers collapsed without JavaScript or stored
 * state — keyboard and screen-reader support comes for free.
 */
function StudyQa({ items }: { items: StudyQaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className={QA}>
      {items.map((item, index) => (
        <details key={`${item.question}-${index}`} className={ITEM}>
          <summary className={QUESTION}>
            <StudyInline text={item.question} />
          </summary>
          <div className={ANSWER}>
            <StudyProse markdown={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}

export default memo(StudyQa);
