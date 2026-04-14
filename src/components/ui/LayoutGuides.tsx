/**
 * Structural layout guides — two vertical dashed lines at the left and right
 * edges of the content max-width (68rem), running the full height of the viewport.
 *
 * These align with the actual content boundary, creating a "blueprint showing
 * through" effect that adds structural cohesion across all sections.
 */
export function LayoutGuides() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="relative mx-auto h-full max-w-content">
        <div className="absolute inset-y-0 left-0 border-text/[0.05] border-l border-dashed [[data-theme=light]_&]:border-text/[0.12]" />
        <div className="absolute inset-y-0 right-0 border-text/[0.05] border-r border-dashed [[data-theme=light]_&]:border-text/[0.12]" />
      </div>
    </div>
  );
}
