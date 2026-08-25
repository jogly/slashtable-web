import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
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

const markdownComponents: Components = {
  a: ({ href, children }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className="text-accent underline underline-offset-2 transition-colors hover:text-text">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-accent underline underline-offset-2 transition-colors hover:text-text"
      >
        {children}
      </a>
    );
  },
  // Body markdown must not introduce a second page-level H1.
  h1: ({ children }) => (
    <h2 id={headingId(children)} className="mt-8 mb-3 font-display text-text text-xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 id={headingId(children)} className="mt-8 mb-3 font-display text-text text-xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mt-6 mb-2 font-medium font-mono text-sm text-text">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mb-4 text-sm text-text-secondary leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-text-secondary leading-relaxed">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-text-secondary leading-relaxed">{children}</ol>
  ),
  li: ({ children }) => <li className="text-sm text-text-secondary leading-relaxed">{children}</li>,
  code: ({ children, className }) => {
    if (className) {
      return <code className="font-mono text-[11px] text-text-secondary leading-relaxed sm:text-sm">{children}</code>;
    }
    return <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-text text-xs">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-sm border border-border bg-bg/60 p-4 backdrop-blur-md">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-accent border-l-2 pl-4 text-sm text-text-secondary">{children}</blockquote>
  ),
};

export function BlogMarkdown({ content }: { content: string }) {
  return <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>;
}
