"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { blockClass } from "../model/study-blocks";

const CODE_WRAP = blockClass("codeWrap");
const CODE_BAR = blockClass("codeBar");
const CODE_LANG = blockClass("codeLang");
const CODE = blockClass("code");
const COPY = blockClass("copy");
const COPY_COPIED = blockClass("copyCopied");

// не memo: внутри состояние копирования
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
    <div className={CODE_WRAP}>
      <div className={CODE_BAR}>
        <span className={CODE_LANG}>{language || "code"}</span>
        <button
          type="button"
          className={[COPY, copied ? COPY_COPIED : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={handleCopy}
          aria-label={copied ? "Скопировано" : "Копировать код"}
          title={copied ? "Скопировано" : "Копировать"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className={CODE}>
        <code className={language ? `hljs language-${language}` : "hljs"}>
          {children ?? code}
        </code>
      </pre>
    </div>
  );
}
