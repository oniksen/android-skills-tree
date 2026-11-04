"use client";

import { STUDY_BLOCK } from "../model/study-blocks";
import type { StudyCardItem } from "../model/parse-study-document";
import StudyInline from "./StudyInline";
import StudyProse from "./StudyProse";

export default function StudyCards({ items }: { items: StudyCardItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className={STUDY_BLOCK.cards}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className={STUDY_BLOCK.card}>
          {item.title ? (
            <p className={STUDY_BLOCK.cardTitle}>
              <StudyInline text={item.title} />
            </p>
          ) : null}
          {item.content ? <StudyProse markdown={item.content} /> : null}
        </div>
      ))}
    </div>
  );
}
