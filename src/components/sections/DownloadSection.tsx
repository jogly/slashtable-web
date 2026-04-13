import macosFolderBack from "@assets/macos-folder-back.png";
import macosFolderFore from "@assets/macos-folder-fore.png";
import { DndContext, type DragEndEvent, type DragOverEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDownload } from "../../hooks/useDownload";
import { trackDownloadStarted } from "../../lib/analytics";
import { DOWNLOAD } from "../../lib/copy";
import { ContentContainer } from "../ui/ContentContainer";
import { FadeIn } from "../ui/FadeIn";
import { NoiseTexture } from "../ui/NoiseTexture";
import { ThankYouModal } from "../ui/ThankYouModal";

/* ── Draggable app icon ─────────────────────────────────────── */

function AppIcon({ dropped, isOverFolder }: { dropped: boolean; isOverFolder: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: "app-icon" });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <motion.div
      className="flex flex-col items-center gap-2.5"
      animate={dropped ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`cursor-grab touch-none transition-opacity duration-150 active:cursor-grabbing ${
          isDragging && !isOverFolder ? "drop-shadow-[0_0_40px_rgba(201,74,0,0.5)]" : ""
        } ${isOverFolder ? "opacity-0" : ""}`}
      >
        <img
          src="/app-icon.png"
          alt="SlashTable"
          className="h-20 w-20 select-none drop-shadow-[0_0_30px_rgba(201,74,0,0.25)] lg:h-24 lg:w-24"
          draggable={false}
        />
      </div>
      <span
        className={`select-none font-mono text-[11px] text-text-secondary tracking-wide transition-opacity duration-150 ${
          isDragging ? "opacity-0" : ""
        }`}
      >
        {DOWNLOAD.appLabel}
      </span>
    </motion.div>
  );
}

/* ── Droppable Downloads folder (layered back → icon → fore) ── */

function DownloadsFolder({ dropped, isOverFolder }: { dropped: boolean; isOverFolder: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: "downloads-folder" });

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        ref={setNodeRef}
        className="relative h-20 w-20 overflow-visible lg:h-24 lg:w-24"
        style={{ perspective: "300px", perspectiveOrigin: "center bottom" }}
      >
        {/* Back layer (rear wall) — same size/position as fore */}
        <img
          src={macosFolderBack}
          alt=""
          className="absolute inset-0 h-full w-full select-none"
          style={{ zIndex: 1 }}
          draggable={false}
        />

        {/* App icon snapped between layers */}
        <AnimatePresence>
          {isOverFolder && (
            <motion.img
              src="/app-icon.png"
              alt=""
              className="pointer-events-none absolute top-0 left-1/2 h-10 w-10 lg:h-12 lg:w-12"
              style={{ zIndex: 2 }}
              initial={{ opacity: 0, scale: 0.3, x: "-50%", y: "-30%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-30%" }}
              exit={{ opacity: 0, scale: 0.5, x: "-50%", y: "-30%" }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              draggable={false}
            />
          )}
        </AnimatePresence>

        {/* Front layer — tilted toward viewer, anchored at bottom */}
        <div
          className="absolute inset-0 origin-top"
          style={{
            zIndex: 3,
            transform: "rotateX(-20deg)",
          }}
        >
          <motion.img
            src={macosFolderFore}
            alt="Downloads folder"
            className="h-full w-full select-none"
            draggable={false}
            animate={{
              scale: isOver ? 1.05 : dropped ? [1.06, 1] : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        </div>

        {/* Highlight ring */}
        <AnimatePresence>
          {isOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute -inset-3 rounded-md border border-cyan/30 bg-cyan/5"
              style={{ zIndex: 4 }}
            />
          )}
        </AnimatePresence>
      </div>
      <span className="select-none font-mono text-[11px] text-text-secondary tracking-wide">
        {DOWNLOAD.folderLabel}
      </span>
    </div>
  );
}

/* ── Flowing direction indicator ─────────────────────────────── */

function FlowIndicator() {
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-6 lg:gap-3 lg:px-10">
      {[0, 1, 2].map((i) => (
        <motion.svg key={i} viewBox="0 0 10 18" className="h-4 w-2" fill="none">
          <motion.path
            d="M2 2 L8 9 L2 16"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              stroke: ["rgba(255,255,255,0.06)", "rgba(201,74,0,0.45)", "rgba(255,255,255,0.06)"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: i * 0.35,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      ))}
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────── */

export function DownloadSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { release, isIntel, primary, secondary, label, altLabel, showThankYou, openThankYou, closeThankYou } =
    useDownload();
  const [dropped, setDropped] = useState(false);
  const [isOverFolder, setIsOverFolder] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const t1Ref = useRef<number>(undefined);
  const t2Ref = useRef<number>(undefined);
  const t3Ref = useRef<number>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(t1Ref.current);
      window.clearTimeout(t2Ref.current);
      window.clearTimeout(t3Ref.current);
    };
  }, []);

  function handleDragOver(event: DragOverEvent) {
    setIsOverFolder(event.over?.id === "downloads-folder");
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsOverFolder(false);
    if (event.over?.id === "downloads-folder") {
      setDropped(true);
      t1Ref.current = window.setTimeout(() => {
        trackDownloadStarted({
          architecture: isIntel ? "intel" : "silicon",
          version: release?.version,
          source: "download_section_drag",
        });
        if (primary) downloadRef.current?.click();
        t2Ref.current = window.setTimeout(() => {
          setDropped(false);
          openThankYou();
        }, 1200);
      }, 350);
    }
  }

  return (
    <section id="download" className="relative overflow-hidden py-16 lg:py-24">
      <NoiseTexture variant="grain" opacity={0.45} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,74,0,0.08)_0%,transparent_60%)]" />

      <ContentContainer className="relative text-center">
        {!hideHeader && (
          <FadeIn>
            <h2 className="font-display text-3xl text-text tracking-tight lg:text-5xl">
              {(() => {
                const [before, after] = DOWNLOAD.heading;
                return (
                  <>
                    <span className="font-mono tracking-tighter">{before}</span>
                    <span className="ml-2 font-display tracking-wide">{after}</span>
                  </>
                );
              })()}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-text-secondary leading-relaxed">{DOWNLOAD.description}</p>
          </FadeIn>
        )}

        <FadeIn delay={hideHeader ? 0 : 0.1}>
          {/* DMG-style drag area — desktop */}
          <div className="mx-auto mt-10 hidden max-w-md rounded-md border border-border bg-surface-2/50 px-8 py-10 shadow-[0_0_80px_-20px_rgba(201,74,0,0.1)] backdrop-blur-sm lg:block">
            <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
              <div className="flex items-center justify-center">
                <AppIcon dropped={dropped} isOverFolder={isOverFolder} />
                <FlowIndicator />
                <DownloadsFolder dropped={dropped} isOverFolder={isOverFolder} />
              </div>
            </DndContext>

            <AnimatePresence mode="wait">
              {dropped ? (
                <motion.p
                  key="downloading"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 font-mono text-[10px] text-green uppercase tracking-widest"
                >
                  {DOWNLOAD.downloading}
                </motion.p>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 font-mono text-[10px] text-text-muted uppercase tracking-widest"
                >
                  {DOWNLOAD.dragHint}
                  {release && <span className="ml-2 opacity-60">&middot; v{release.version}</span>}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile download button */}
          <div className="mt-10 flex flex-col items-center gap-4 lg:hidden">
            <a
              href={primary}
              {...(primary ? { download: true } : { "aria-disabled": true })}
              onClick={() => {
                trackDownloadStarted({
                  architecture: isIntel ? "intel" : "silicon",
                  version: release?.version,
                  source: "download_section_mobile",
                });
                t3Ref.current = window.setTimeout(openThankYou, 500);
              }}
              className={`inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 font-mono text-black text-xs uppercase tracking-widest shadow-[0_0_32px_-4px_rgba(201,74,0,0.4)] transition-[background-color,box-shadow] duration-150 hover:bg-white hover:shadow-[0_0_32px_-4px_rgba(255,255,255,0.2)]${
                !primary ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Download className="h-4 w-4" />
              <span className="flex flex-wrap justify-center gap-x-1">
                <span className="whitespace-nowrap">{DOWNLOAD.downloadLabel}</span>
                <span className="whitespace-nowrap">({label})</span>
              </span>
              {release && <span className="whitespace-nowrap opacity-60">&mdash; v{release.version}</span>}
            </a>
          </div>

          {/* Hidden download trigger */}
          {/* biome-ignore lint/a11y/useAnchorContent: hidden programmatic download trigger */}
          <a ref={downloadRef} href={primary} download className="hidden" tabIndex={-1} aria-hidden="true" />

          {/* Button fallback — desktop */}
          <div className="mt-8 hidden flex-col items-center gap-3 lg:flex">
            <p className="font-mono text-[10px] text-text-muted italic tracking-wide">{DOWNLOAD.buttonFallback}</p>
            <a
              href={primary}
              {...(primary ? { download: true } : { "aria-disabled": true })}
              onClick={() => {
                trackDownloadStarted({
                  architecture: isIntel ? "intel" : "silicon",
                  version: release?.version,
                  source: "download_section_button",
                });
                t3Ref.current = window.setTimeout(openThankYou, 500);
              }}
              className={`inline-flex items-center gap-2.5 rounded-full bg-accent px-8 py-3.5 font-mono text-black text-xs uppercase tracking-widest shadow-[0_0_32px_-4px_rgba(201,74,0,0.4)] transition-[background-color,box-shadow] duration-150 hover:bg-white hover:shadow-[0_0_32px_-4px_rgba(255,255,255,0.2)]${
                !primary ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Download className="h-4 w-4" />
              {DOWNLOAD.downloadLabel} ({label})
              {release && <span className="opacity-60">&mdash; v{release.version}</span>}
            </a>
            <a
              href={secondary}
              {...(secondary ? { download: true } : { "aria-disabled": true })}
              className={`font-mono text-[10px] text-text-muted uppercase tracking-widest underline underline-offset-2 transition-colors hover:text-text${
                !secondary ? "pointer-events-none invisible" : ""
              }`}
            >
              {DOWNLOAD.altAvailableLabel} {altLabel}
            </a>
          </div>

          {/* Secondary links */}
          <div className="mt-4 flex flex-col items-center gap-2 lg:mt-6">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{DOWNLOAD.platformNotice}</p>
          </div>
        </FadeIn>
      </ContentContainer>

      <ThankYouModal open={showThankYou} onClose={closeThankYou} />
    </section>
  );
}
