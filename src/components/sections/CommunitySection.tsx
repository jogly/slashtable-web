import { FadeIn } from "../ui/FadeIn";
import { SectionHeading } from "../ui/SectionHeading";

export function CommunitySection() {
  return (
    <section className="border-border border-t py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Community"
            description="Join the Discord to ask questions, share feedback, and follow development."
          >
            Build with us
          </SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex justify-center">
            <iframe
              src="https://discord.com/widget?id=1490745934571896895&theme=dark"
              title="Discord community widget"
              width="350"
              height="500"
              allowTransparency={true}
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="rounded-lg"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
