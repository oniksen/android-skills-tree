"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import StudyCodeBlock from "./StudyCodeBlock";

export default function StudyMarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="study-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);
            if (!isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            const text = String(children).replace(/\n$/, "");
            return <StudyCodeBlock code={text}>{children}</StudyCodeBlock>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
