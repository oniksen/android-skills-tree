"use client";

import React from "react";
import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import { STUDY_BLOCK } from "../model/study-blocks";
import StudyCodeBlock from "./StudyCodeBlock";

function isCheckbox(node: ReactNode): boolean {
  if (!React.isValidElement(node)) return false;
  if (node.type === "input") {
    return (node.props as { type?: string }).type === "checkbox";
  }
  return false;
}

/** remark-gfm may wrap a task item in a paragraph, so walk the tree. */
function hasCheckbox(node: ReactNode): boolean {
  if (Array.isArray(node)) return node.some(hasCheckbox);
  if (isCheckbox(node)) return true;
  if (!React.isValidElement(node)) return false;
  return hasCheckbox((node.props as { children?: ReactNode }).children);
}

/** Plain text of a rendered subtree — used for the copy button and labels. */
export function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (!React.isValidElement(node)) return "";
  return extractText((node.props as { children?: ReactNode }).children);
}

interface ComponentOptions {
  /** Sources section: link lists become pills. */
  sources?: boolean;
  /** Inline rendering inside headings and card titles. */
  inline?: boolean;
}

export function createStudyMarkdownComponents({
  sources = false,
  inline = false,
}: ComponentOptions = {}): Components {
  const heading =
    (className: string, weight: "h3" | "h4" = "h3") => {
      const StudyHeading = ({ children }: { children?: ReactNode }) => {
        if (weight === "h4") {
          return (
            <h4 className={`${STUDY_BLOCK.subtitle} ${STUDY_BLOCK.subtitleMinor}`}>
              {children}
            </h4>
          );
        }
        return <h3 className={className}>{children}</h3>;
      };
      StudyHeading.displayName = weight === "h4" ? "StudyHeading4" : "StudyHeading3";
      return StudyHeading;
    };

  return {
    p: inline
      ? ({ children }) => <>{children}</>
      : ({ children }) => <p>{children}</p>,
    h1: heading(STUDY_BLOCK.subtitle),
    h2: heading(STUDY_BLOCK.subtitle),
    h3: heading(STUDY_BLOCK.subtitle),
    h4: heading(STUDY_BLOCK.subtitle, "h4"),
    h5: heading(STUDY_BLOCK.subtitle, "h4"),
    h6: heading(STUDY_BLOCK.subtitle, "h4"),
    ul: ({ children }) => {
      if (sources) return <ul className={STUDY_BLOCK.pills}>{children}</ul>;
      if (hasCheckbox(children)) {
        return <ul className={STUDY_BLOCK.checklist}>{children}</ul>;
      }
      return <ul className={STUDY_BLOCK.list}>{children}</ul>;
    },
    ol: ({ children }) => <ol className={STUDY_BLOCK.list}>{children}</ol>,
    li: ({ children }) => (
      <li className={hasCheckbox(children) ? STUDY_BLOCK.checkItem : undefined}>
        {children}
      </li>
    ),
    table: ({ children }) => (
      <div
        className={STUDY_BLOCK.tableWrap}
        role="region"
        aria-label="Таблица"
        tabIndex={0}
      >
        <table className={STUDY_BLOCK.table}>{children}</table>
      </div>
    ),
    pre: ({ children }) => {
      const child = Array.isArray(children) ? children[0] : children;
      if (!React.isValidElement(child)) return <pre>{children}</pre>;

      const props = child.props as { className?: string; children?: ReactNode };
      const language = /language-([\w-]+)/.exec(props.className ?? "")?.[1] ?? "";

      return (
        <StudyCodeBlock language={language} code={extractText(props.children)}>
          {props.children}
        </StudyCodeBlock>
      );
    },
    code: ({ children }) => <code>{children}</code>,
    blockquote: ({ children }) => (
      <div className={STUDY_BLOCK.note}>{children}</div>
    ),
    a: ({ href, children }) => {
      if (sources) {
        return (
          <a
            className={STUDY_BLOCK.pill}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }

      const external = typeof href === "string" && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt }) => (
      <figure className={STUDY_BLOCK.figure}>
        {/* Markdown images point at arbitrary hosts; next/image needs a configured allowlist. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} loading="lazy" />
        {alt ? (
          <figcaption className={STUDY_BLOCK.caption}>{alt}</figcaption>
        ) : null}
      </figure>
    ),
    hr: () => <hr className={STUDY_BLOCK.divider} />,
  };
}

export const STUDY_MARKDOWN_COMPONENTS = createStudyMarkdownComponents();
export const STUDY_SOURCES_COMPONENTS = createStudyMarkdownComponents({
  sources: true,
});
export const STUDY_INLINE_COMPONENTS = createStudyMarkdownComponents({
  inline: true,
});
