"use client";

import Link from "next/link";
import Image from "next/image";
import { IHeroFixedItem } from "@/features/config/types";

interface HeroFixedProps {
  items: IHeroFixedItem[];
}

const HeroFixed = ({ items }: HeroFixedProps) => {
  const [main, top, bottom] = items;

  return (
    <section className="container py-4">
      {/* Outer grid: left large + right stack — grid row stretches both columns equally */}
      <div className="flex flex-col md:grid md:grid-cols-[5fr_2fr] gap-4">

        {/* ── Main large banner ── */}
        {main && (
          <Link
            href={main.link || "#"}
            className="relative overflow-hidden rounded-xl group aspect-video"
          >
            <Image
              src={main.image}
              alt="Hero main banner"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 62vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        )}

        {/* ── Right column: 2 banners stacked, total height = left column height ── */}
        <div className="flex flex-col gap-4">

          {top && (
            <Link
              href={top.link || "#"}
              className="relative overflow-hidden rounded-xl group aspect-video md:flex-1 md:aspect-auto"
            >
              <Image
                src={top.image}
                alt="Hero top right banner"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          )}

          {bottom && (
            <Link
              href={bottom.link || "#"}
              className="relative overflow-hidden rounded-xl group aspect-video md:flex-1 md:aspect-auto"
            >
              <Image
                src={bottom.image}
                alt="Hero bottom right banner"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          )}

        </div>
      </div>
    </section>
  );
};

export default HeroFixed;

