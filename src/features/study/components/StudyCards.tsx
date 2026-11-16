"use client";

import { memo } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudyCardItem } from "../model/parse-study-document";
import StudyInline from "./StudyInline";
import StudyProse from "./StudyProse";

const CARDS = blockClass("cards");
const CARD = blockClass("card");
const CARD_TITLE = blockClass("cardTitle");

function StudyCards({ items }: { items: StudyCardItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className={CARDS}>
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className={CARD}>
          {item.title ? (
            <p className={CARD_TITLE}>
              <StudyInline text={item.title} />
            </p>
          ) : null}
          {item.content ? <StudyProse markdown={item.content} /> : null}
        </div>
      ))}
    </div>
  );
}

export default memo(StudyCards);
