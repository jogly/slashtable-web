import Link from "next/link";
import { formatJournalDate } from "@/lib/dates";

/** Title left, flexing 1px rule, mono date right. One post is one row. */
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
    <Link href={href} className="flex items-baseline gap-3 py-2.5">
      <h2 className="min-w-0 text-[15px] font-normal text-text leading-snug">{title}</h2>
      <span aria-hidden className="min-w-6 flex-1 self-center border-border border-t" />
      <time dateTime={publishedAt} className="shrink-0 font-mono text-[12px] text-text-muted">
        {formatJournalDate(publishedAt)}
      </time>
    </Link>
  );
}
