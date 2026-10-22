import { MathJax, MathJaxContext } from "better-react-mathjax";
import React, { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export interface MarkdownRendererProps {
  content: string;
  applyRegex?: boolean;
  onRenderTimeUpdate?: (renderTime: number) => void;
}

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
  },
} as const;

export function fixUnrenderedMath(input: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  const fixedInput = input.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
  const arccot = fixedInput.replace(
    /\\arccot/g,
    " \\operatorname{arccot} ",
  );
  const arcsec = arccot.replace(
    /\\arcsec/g,
    " \\operatorname{arcsec} ",
  );
  const arccsc = arcsec.replace(
    /\\arccsc/g,
    " \\operatorname{arccsc} ",
  );
  return arccsc;
}

export function tryWrapHtmlCode(text: string) {
  // try add wrap html code (fixed: html codeblock include 2 newline)
  // ignore embed codeblock
  if (text.includes("```")) {
    return text;
  }
  return text
    .replace(/<br\s*\/?>/gi, "| \n | |")
    .replace(
      /([`]*?)(\w*?)([\n\r]*?)(<!DOCTYPE html>)/g,
      (match, quoteStart, lang, newLine, doctype) => {
        return !quoteStart ? "\n```html\n" + doctype : match;
      },
    )
    .replace(
      /(<\/body>)([\r\n\s]*?)(<\/html>)([\n\r]*)([`]*)([\n\r]*?)/g,
      (match, bodyEnd, space, htmlEnd, newLine, quoteEnd) => {
        return !quoteEnd
          ? bodyEnd + space + htmlEnd + "\n```\n"
          : match;
      },
    );
}

const _MarkdownRenderer = forwardRef<
  HTMLDivElement,
  MarkdownRendererProps
>(({ content, applyRegex = true }, ref) => {
  React.useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css";
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const processedContent = applyRegex
    ? fixUnrenderedMath(tryWrapHtmlCode(content))
    : content;

  return (
    <div
      className="markdown-body overflow-y-auto rounded-lg"
      ref={ref}
    >
      <MathJaxContext config={config}>
        <MathJax dynamic hideUntilTypeset="every">
          <ReactMarkdown
            remarkPlugins={[
              remarkMath,
              remarkGfm,
              remarkBreaks,
            ]}
            rehypePlugins={[
              rehypeKatex,
              [
                rehypeHighlight,
                {
                  detect: false,
                  ignoreMissing: true,
                },
              ],
            ]}
            components={{
              p: ({ node, ...props }) => (
                <p className="mb-2 last:mb-0" {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h1
                  className="text-2xl font-bold my-4 ml-4"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-bold my-3 ml-4"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-bold my-2 ml-4"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc ml-4 mb-2"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal ml-4 mb-2"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="mb-1" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-300 pl-4 italic my-2"
                  {...props}
                />
              ),
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(
                  className || "",
                );
                if (match) {
                  const lang = match[1];
                  if (lang === "math" || lang === "latex") {
                    return (
                      <div
                        {...(props as React.HTMLAttributes<HTMLDivElement>)}
                        className="mathjax-math"
                      >
                        {children}
                      </div>
                    );
                  }
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              a: ({ node, ...props }) => (
                <a
                  className="text-primary underline hover:text-primary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </MathJax>
      </MathJaxContext>
    </div>
  );
});

_MarkdownRenderer.displayName = "MarkdownRenderer";

export const MarkdownRenderer = React.memo(_MarkdownRenderer);

export default MarkdownRenderer;