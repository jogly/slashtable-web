import { formatJournalDate } from "@/lib/dates";

export function BlogDate({
  publishedAt,
  updatedAt,
}: {
  publishedAt: string;
  updatedAt?: string;
}) {
  return (
    <p className="font-mono text-[12px] leading-5 text-text-muted">
      <time dateTime={publishedAt}>{formatJournalDate(publishedAt)}</time>
      {updatedAt && updatedAt !== publishedAt ? (
        <>
          <span aria-hidden> · </span>
          <time dateTime={updatedAt}>Updated {formatJournalDate(updatedAt)}</time>
        </>
      ) : null}
    </p>
  );
}
