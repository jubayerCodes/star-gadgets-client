// Skeleton for the fixed 3-panel hero layout (main + 2 stacked side panels)
export const HeroFixedSkeleton = () => (
  <section className="container py-4">
    <div className="flex flex-col md:grid md:grid-cols-[5fr_2fr] gap-4 animate-pulse">
      {/* Main large panel */}
      <div className="rounded-xl aspect-video bg-foreground/6" />

      {/* Right column — 2 stacked panels */}
      <div className="flex flex-col gap-4">
        <div
          className="rounded-xl aspect-video md:flex-1 md:aspect-auto bg-foreground/6"
          style={{ minHeight: "clamp(80px, 10vw, 160px)" }}
        />
        <div
          className="rounded-xl aspect-video md:flex-1 md:aspect-auto bg-foreground/6"
          style={{ minHeight: "clamp(80px, 10vw, 160px)" }}
        />
      </div>
    </div>
  </section>
);

// Skeleton for the full-width carousel hero layout
export const HeroCarouselSkeleton = () => (
  <div className="w-full animate-pulse">
    <div
      className="w-full bg-foreground/6"
      style={{ aspectRatio: "16 / 5.5" }}
    />
  </div>
);
