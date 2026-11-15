"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { blockClass } from "../model/study-blocks";

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
    <div className={blockClass("codeWrap")}>
      <div className={blockClass("codeBar")}>
        <span className={blockClass("codeLang")}>{language || "code"}</span>
        <button
          type="button"
          className={[blockClass("copy"), copied ? blockClass("copyCopied") : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={handleCopy}
          aria-label={copied ? "Скопировано" : "Копировать код"}
          title={copied ? "Скопировано" : "Копировать"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className={blockClass("code")}>
        <code className={language ? `hljs language-${language}` : "hljs"}>
          {children ?? code}
        </code>
      </pre>
    </div>
  );
}
