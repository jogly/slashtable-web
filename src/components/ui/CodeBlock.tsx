import { cn } from "../../lib/utils";

interface CodeBlockProps {
  code: string;
  filename?: string;
  className?: string;
}

function highlightSyntax(code: string): string {
  // Escape HTML entities first to prevent XSS, then apply syntax highlighting.
  const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(
    /("(?:[^"\\]|\\.)*")|\b(import|from|export|default|class|extends|const|let|var|function|return|new|if|else|true|false|null|undefined|type)\b|\b(\d+)\b/gm,
    (_match, str, keyword, num) => {
      if (str !== undefined) return `<span style="color:#44ff88">${str}</span>`;
      if (keyword !== undefined) return `<span style="color:#c94a00">${keyword}</span>`;
      if (num !== undefined) return `<span style="color:#ffcc00">${num}</span>`;
      return _match;
    },
  );
}

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  return (
    <div className={cn("overflow-hidden rounded-sm border border-border shadow-lg shadow-black/20", className)}>
      {filename && (
        <div className="flex items-center gap-2 border-border border-b bg-surface px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
            <div className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
            <div className="h-2 w-2 rounded-full bg-[#28c840]/60" />
          </div>
          <span className="ml-2 font-mono text-text-muted text-xs">{filename}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-surface-2 p-4" style={{ scrollbarWidth: "none" }}>
        <code
          className="font-mono text-[11px] text-text-secondary leading-relaxed sm:text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: content is HTML-escaped before highlighting
          dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
        />
      </pre>
    </div>
  );
}
