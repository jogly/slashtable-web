import { createFileRoute } from "@tanstack/react-router";
import { ContentContainer } from "../components/ui/ContentContainer";
import { FadeIn } from "../components/ui/FadeIn";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-32 pb-20">
      <ContentContainer>
        {/* Header */}
        <FadeIn>
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 font-mono text-accent text-xs uppercase tracking-widest">About</p>
            <h1 className="font-display text-4xl text-text lg:text-5xl">/table</h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              A database tool built by one person, for himself first.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-2xl space-y-20">
          {/* §1 — Why /table exists */}
          <FadeIn>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Origin</span>
              </div>
              <h2 className="font-display text-2xl text-text lg:text-3xl">Why /table exists</h2>

              <div className="mt-6 space-y-5 text-text-secondary leading-relaxed">
                <p>Joe didn't have one moment. He had fifteen years.</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "It was not one moment; it was the past 15 years of being frustrated with the tools."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "I always wanted to, but I always had a job. Now I don't have a job like this. I want this to exist,
                    and I'm tired of it not existing."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "It is like my employment held me back from doing what I wanted to do, and I wanted this to exist,
                    and I couldn't, and now I can create."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  Every employed week was another week of using the wrong tool, asking{" "}
                  <em>why doesn't this work the way I think?</em>, and being too taxed to build the right one. The
                  frustration compounded. /table is its release.
                </p>

                <p>The mission statement, in Joe's words:</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "I am one person. I think it should exist. I created the bare bones version of what I want, and now
                    I have it. I want to make it valuable to other people also."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  Three moves: (1) it should exist, (2) bare-bones is shipped and serves him, (3) widening the value to
                  others is the work now.
                </p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">"Oh, it's not shut down. It's up. There's no shutting it down."</p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>/table is permanent infrastructure for Joe regardless of commercial outcome.</p>
              </div>
            </section>
          </FadeIn>

          {/* §2 — The maker's epistemology */}
          <FadeIn>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Epistemology</span>
              </div>
              <h2 className="font-display text-2xl text-text lg:text-3xl">The maker's epistemology</h2>

              <div className="mt-6 space-y-5 text-text-secondary leading-relaxed">
                <p>
                  At Uber, Joe insisted on writing documentation for months before touching code — long past the point
                  that frustrated colleagues. His explanation is the meta-key to understanding why /table is built the
                  way it is:
                </p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "It was really powered by my ignorance. My motivation has always been to understand, and the
                    documents, diagramming, and laying that foundation is how I understand, and once I have the
                    understanding, I can argue it. I don't like arguing stuff I don't understand."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  The product reflects the maker. Joe values understanding before action. Exploration is how you
                  generate understanding before you commit to a query. Every other database tool inverts this — it
                  forces you to write a SELECT before you can see what you're selecting from. /table makes exploration
                  the precondition, because Joe makes understanding the precondition.
                </p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "/table doesn't make you take care of the database without making you into a database."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Eugene</p>
                </blockquote>
              </div>
            </section>
          </FadeIn>

          {/* §3 — The principle */}
          <FadeIn>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Principle</span>
              </div>
              <h2 className="font-display text-2xl text-text lg:text-3xl">The principle</h2>

              <div className="mt-6 space-y-5 text-text-secondary leading-relaxed">
                <p>Joe's organizing principle for the product:</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="font-display text-text text-xl">"Software you are happy to wake up to."</p>
                  <p className="mt-1 text-text italic">It's just joy, joy to use.</p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  Not a marketing line. An operational filter. Every design decision gets evaluated against it. A tool
                  that catches your mistakes before they become postmortems is, by definition, a tool you're happy to
                  wake up to. A tool that makes you into a database admin is not.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* §4 — The stance (Bezos) */}
          <FadeIn>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Stance</span>
              </div>
              <h2 className="font-display text-2xl text-text lg:text-3xl">The stance</h2>

              <div className="mt-6 space-y-5 text-text-secondary leading-relaxed">
                <p>On competitors, Joe is consistent and deliberate:</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "I personally don't like calling out competition. I want it to stand on its own."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>The reason, by way of Bezos:</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "Bezos: 'I don't want employees waking up at night terrified of competitors. I want them terrified
                    of waking up with disappointing customers.' That's what I care about."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  The site has no comparison matrix. That omission is not a v0 oversight — it is a brand stance. /table
                  is what it is. People will pick.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* §5 — The fear (Travis) */}
          <FadeIn>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Fear</span>
              </div>
              <h2 className="font-display text-2xl text-text lg:text-3xl">The fear</h2>

              <div className="mt-6 space-y-5 text-text-secondary leading-relaxed">
                <p>What failure mode worries Joe most? Without hesitation:</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "I don't know, no one cares, and what are you going to do about it? In the spirit of Travis, your
                    fear is the disease; hustle is the antidote."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "If no one cares, then it's a bad idea, but it's not; you believe in it, so what are you going to
                    do?"
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  Joe's failure mode is irrelevance, not competition. His response to that fear is not risk mitigation —
                  it is hustle. Product decisions follow from belief and customer care, not from competitor defense or
                  feature parity.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* §6 — The intent going forward */}
          <FadeIn>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">What's next</span>
              </div>
              <h2 className="font-display text-2xl text-text lg:text-3xl">The intent going forward</h2>

              <div className="mt-6 space-y-5 text-text-secondary leading-relaxed">
                <p>Bare-bones is shipped. It serves Joe. The next phase is widening.</p>

                <p>The feature Joe is most invested in growing: richer data presentation.</p>

                <blockquote className="border-border border-l-2 pl-5">
                  <p className="text-text">
                    "All the database tools just present you raw data, but that raw data is so low value; it usually
                    means something. The one feature that I just absolutely love and is less invested right now but I
                    want to grow significantly more is adding richer presentation."
                  </p>
                  <p className="mt-2 font-mono text-[10px] text-text-muted uppercase tracking-widest">Joe</p>
                </blockquote>

                <p>
                  The product will make bets based on what Joe believes, informed by what users ask for. The arc from
                  here is: make it more valuable to more people, without losing the thing that made it valuable to Joe.
                </p>
              </div>
            </section>
          </FadeIn>
        </div>
      </ContentContainer>
    </div>
  );
}
