"use client";

import { useState } from "react";

export default function StudyCodeBlock({ code }: { code: string }) {
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
      <button type="button" className="study-copy" onClick={handleCopy}>
        {copied ? "Скопировано" : "Копировать"}
      </button>
      <pre className="study-code">
        <code>{code}</code>
      </pre>
    </div>
  );
}
