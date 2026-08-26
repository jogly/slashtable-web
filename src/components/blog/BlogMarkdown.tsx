import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { blogHeadingId } from "@/lib/blog-headings";
import { BlogFigure } from "./BlogFigure";
import { BlogHeadingHash } from "./BlogHeadingHash";

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textFromNode(node.props.children);
  return "";
}

function imageFromChildren(children: ReactNode): { src: string; alt: string } | null {
  const items = Children.toArray(children).filter((child) => {
    if (typeof child === "string") return child.trim() !== "";
    return true;
  });
  if (items.length !== 1 || !isValidElement(items[0])) return null;
  const props = items[0].props as { src?: unknown; alt?: unknown };
  if (typeof props.src !== "string" || props.src === "") return null;
  return { src: props.src, alt: typeof props.alt === "string" ? props.alt : "" };
}

const body = "font-sans text-[1rem] leading-[1.6] text-text";
const inkLink =
  "text-text underline decoration-border-strong underline-offset-[0.18em] transition-colors hover:decoration-accent";

function BlogSectionHeading({ as: Tag, children }: { as: "h2" | "h3"; children: ReactNode }) {
  const label = textFromNode(children);
  const id = blogHeadingId(label);
  const type =
    Tag === "h2"
      ? "mt-16 mb-6 font-sans text-[1.85rem] text-text leading-[1.15] md:text-[2rem]"
      : "mt-9 mb-3 font-medium text-[1.125rem] text-text leading-snug";

  return (
    <Tag id={id} className={`group relative scroll-mt-24 ${type}`}>
      <BlogHeadingHash id={id} label={label} />
      {children}
    </Tag>
  );
}

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
  h1: ({ children }) => <BlogSectionHeading as="h2">{children}</BlogSectionHeading>,
  h2: ({ children }) => <BlogSectionHeading as="h2">{children}</BlogSectionHeading>,
  h3: ({ children }) => <BlogSectionHeading as="h3">{children}</BlogSectionHeading>,
  img: ({ src, alt }) => {
    if (!src) return null;
    return <img src={src} alt={alt ?? ""} />;
  },
  p: ({ children }) => {
    const figure = imageFromChildren(children);
    if (figure) {
      return <BlogFigure src={figure.src} caption={figure.alt} />;
    }
    const text = textFromNode(children).trim();
    if (/^https?:\/\/\S+$/.test(text)) {
      return null;
    }
    return <p className={`mb-5 ${body}`}>{children}</p>;
  },
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
    <blockquote className="my-8 font-sans text-[1.2rem] text-text italic leading-[1.55]">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-border border-b last:border-b-0">{children}</tr>,
  th: ({ children }) => (
    <th className="py-3 pr-6 align-bottom font-sans text-[12px] font-normal text-text-muted">{children}</th>
  ),
  td: ({ children }) => (
    <td className="py-3.5 pr-6 align-top font-sans text-[1rem] leading-[1.55] text-text first:font-medium">
      {children}
    </td>
  ),
  hr: () => <hr className="my-12 border-border border-t" />,
};

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}
