import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textFromNode(node.props.children);
  return "";
}

function headingId(children: ReactNode): string {
  return textFromNode(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const body = "text-[1.125rem] leading-[1.7] text-text";
const inkLink =
  "text-text underline decoration-border-strong underline-offset-[0.18em] transition-colors hover:decoration-accent";

const markdownComponents: Components = {
  a: ({ href, children }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={inkLink}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className={inkLink}
      >
        {children}
      </a>
    );
  },
  // Body markdown must not introduce a second page-level H1.
  h1: ({ children }) => (
    <h2 id={headingId(children)} className="mt-14 mb-4 font-display text-[1.75rem] text-text leading-[1.15] md:text-3xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 id={headingId(children)} className="mt-14 mb-4 font-display text-[1.75rem] text-text leading-[1.15] md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mt-9 mb-3 font-medium text-[1.125rem] text-text leading-snug">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className={`mb-5 ${body}`}>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className={`mb-5 list-disc space-y-2 pl-5 ${body}`}>{children}</ul>,
  ol: ({ children }) => <ol className={`mb-5 list-decimal space-y-2 pl-5 ${body}`}>{children}</ol>,
  li: ({ children }) => <li className={body}>{children}</li>,
  code: ({ children, className }) => {
    if (className) {
      return <code className="font-mono text-[13px] text-text leading-7 sm:text-sm">{children}</code>;
    }
    return <code className="rounded-[2px] bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-text">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="mb-6 overflow-x-auto border border-border bg-surface-2/70 px-4 py-3.5 text-text">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 font-display text-[1.2rem] text-text italic leading-[1.55]">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[1.02rem] leading-6 text-text">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-border-strong border-b">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-border border-b last:border-b-0">{children}</tr>,
  th: ({ children }) => <th className="py-2.5 pr-5 align-bottom font-semibold text-text">{children}</th>,
  td: ({ children }) => <td className="py-3 pr-5 align-top text-text">{children}</td>,
  hr: () => <hr className="my-12 border-border border-t" />,
};

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}
