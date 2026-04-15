"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IHeroFixedItem } from "@/features/config/types";

interface HeroFixedProps {
  items: IHeroFixedItem[];
}

/** Shimmer overlay shown while a Cloudinary image is in-flight */
const ImageShimmer = ({ loaded }: { loaded: boolean }) => (
  <span
    className={`absolute inset-0 bg-foreground/[0.06] animate-pulse rounded-xl transition-opacity duration-300 ${
      loaded ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}
  />
);

const HeroFixed = ({ items }: HeroFixedProps) => {
  const [main, top, bottom] = items;

  const [mainLoaded, setMainLoaded] = useState(false);
  const [topLoaded, setTopLoaded] = useState(false);
  const [bottomLoaded, setBottomLoaded] = useState(false);

  return (
    <section className="container py-4">
      {/* Outer grid: left large + right stack */}
      <div className="flex flex-col md:grid md:grid-cols-[5fr_2fr] gap-4">

        {/* ── Main large banner ── */}
        {main && (
          <Link
            href={main.link || "#"}
            className="relative overflow-hidden rounded-xl group aspect-video"
          >
            <ImageShimmer loaded={mainLoaded} />
            <Image
              src={main.image}
              alt="Hero main banner"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 62vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onLoad={() => setMainLoaded(true)}
            />
          </Link>
        )}

        {/* ── Right column: 2 banners stacked ── */}
        <div className="flex flex-col gap-4">

          {top && (
            <Link
              href={top.link || "#"}
              className="relative overflow-hidden rounded-xl group aspect-video md:flex-1 md:aspect-auto"
            >
              <ImageShimmer loaded={topLoaded} />
              <Image
                src={top.image}
                alt="Hero top right banner"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onLoad={() => setTopLoaded(true)}
              />
            </Link>
          )}

          {bottom && (
            <Link
              href={bottom.link || "#"}
              className="relative overflow-hidden rounded-xl group aspect-video md:flex-1 md:aspect-auto"
            >
              <ImageShimmer loaded={bottomLoaded} />
              <Image
                src={bottom.image}
                alt="Hero bottom right banner"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onLoad={() => setBottomLoaded(true)}
              />
            </Link>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeroFixed;


