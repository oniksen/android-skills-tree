"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function StudyCodeBlock({
  code,
  children,
}: {
  code: string;
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
    <div className="study-code-wrap">
      <button
        type="button"
        className={`study-copy ${copied ? "study-copy--copied" : ""}`}
        onClick={handleCopy}
        aria-label={copied ? "Скопировано" : "Копировать код"}
        title={copied ? "Скопировано" : "Копировать"}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="study-code">
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}