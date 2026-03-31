import { cn } from "../../lib/utils";

interface CodeBlockProps {
  code: string;
  filename?: string;
  className?: string;
}

function highlightSyntax(code: string): string {
  // Single-pass tokenizer: string literals take priority, preventing
  // keyword/number regexes from matching inside already-emitted spans.
  return code.replace(
    /("(?:[^"\\]|\\.)*")|(^>.*$)|\b(import|from|export|default|class|extends|const|let|var|function|return|new|if|else|true|false|null|undefined|type)\b|\b(\d+)\b/gm,
    (_match, str, comment, keyword, num) => {
      if (str !== undefined) return `<span style="color:#44ff88">${str}</span>`;
      if (comment !== undefined) return `<span style="color:rgba(255,255,255,0.3)">${comment}</span>`;
      if (keyword !== undefined) return `<span style="color:#c94a00">${keyword}</span>`;
      if (num !== undefined) return `<span style="color:#ffcc00">${num}</span>`;
      return _match;
    }
  );
}

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  return (
    <div className={cn("border border-border overflow-hidden", className)}>
      {filename && (
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
            <div className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
            <div className="h-2 w-2 rounded-full bg-[#28c840]/60" />
          </div>
          <span className="ml-2 font-mono text-xs text-text-muted">{filename}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-surface-2 p-4">
        <code
          className="font-mono text-sm leading-relaxed text-text-secondary"
          dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }}
        />
      </pre>
    </div>
  );
}
