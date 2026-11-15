"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { STUDY_BLOCK } from "../model/study-blocks";

export default function StudyCodeBlock({
  code,
  language = "",
  children,
}: {
  code: string;
  language?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={STUDY_BLOCK.codeWrap}>
      <div className={STUDY_BLOCK.codeBar}>
        <span className={STUDY_BLOCK.codeLang}>{language || "code"}</span>
        <button
          type="button"
          className={[STUDY_BLOCK.copy, copied ? STUDY_BLOCK.copyCopied : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={handleCopy}
          aria-label={copied ? "Скопировано" : "Копировать код"}
          title={copied ? "Скопировано" : "Копировать"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className={STUDY_BLOCK.code}>
        <code className={language ? `hljs language-${language}` : "hljs"}>
          {children ?? code}
        </code>
      </pre>
    </div>
  );
}
