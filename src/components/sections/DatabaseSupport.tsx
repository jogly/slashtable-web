import { DATABASE_SUPPORT } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";

function PostgresIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M16 2C8.82 2 3 7.82 3 15s5.82 13 13 13 13-5.82 13-13S23.18 2 16 2z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M12 11h8M12 16h8M12 21h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GenericDbIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <ellipse cx="16" cy="8" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 8v8c0 2.21 4.48 4 10 4s10-1.79 10-4V8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 16v8c0 2.21 4.48 4 10 4s10-1.79 10-4v-8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const dbIcons = [PostgresIcon, GenericDbIcon, GenericDbIcon];

export function DatabaseSupport() {
  return (
    <section className="bg-surface py-20 lg:py-24" id="download">
      <ContentContainer>
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-2 w-2 shrink-0" style={{ backgroundColor: "#c94a00" }} />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              {DATABASE_SUPPORT.eyebrow}
            </span>
          </div>
          <h2 className="font-display text-3xl text-text tracking-tight lg:text-4xl">{DATABASE_SUPPORT.heading}</h2>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {DATABASE_SUPPORT.databases.map((db, i) => {
            const Icon = dbIcons[i];
            return (
              <FadeIn key={db.name}>
                <div
                  className={`flex flex-col items-center gap-3 border px-8 py-6 transition-colors ${
                    db.active ? "border-cyan/40 text-cyan" : "border-border text-text-muted"
                  }`}
                >
                  <Icon />
                  <span className="font-mono text-xs tracking-wide">{db.name}</span>
                  {!db.active && (
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                      {DATABASE_SUPPORT.comingSoon}
                    </span>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </ContentContainer>
    </section>
  );
}
