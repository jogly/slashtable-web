import Link from "next/link";
import { formatJournalDate } from "@/lib/dates";

/** Title + flexing 1px leader + mono date. For Related and for the index after ~6 posts. */
export function BlogLeaderRow({
  href,
  title,
  publishedAt,
}: {
  href: string;
  title: string;
  publishedAt: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 py-2.5">
      <span className="min-w-0 text-[15px] text-text leading-snug">{title}</span>
      <span aria-hidden className="min-w-6 flex-1 border-border border-t" />
      <time dateTime={publishedAt} className="shrink-0 font-mono text-[12px] text-text-muted">
        {formatJournalDate(publishedAt)}
      </time>
    </Link>
  );
}
