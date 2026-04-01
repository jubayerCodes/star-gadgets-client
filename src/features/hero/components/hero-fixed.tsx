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
      {/* Outer grid: left large + right stack */}
      <div className="flex flex-col md:grid md:grid-cols-[5fr_2fr] gap-4 md:h-[480px]">
        
        {/* ── Main large banner ── */}
        {main && (
          <Link
            href={main.link || "#"}
            className="relative overflow-hidden rounded-xl group aspect-16/7 md:aspect-auto"
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

        {/* ── Right column: 2 banners stacked ── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:grid-rows-2 md:h-full">
          
          {top && (
            <Link
              href={top.link || "#"}
              className="relative overflow-hidden rounded-xl group aspect-square md:aspect-auto"
            >
              <Image
                src={top.image}
                alt="Hero top right banner"
                fill
                priority
                sizes="(max-width: 768px) 50vw, 38vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          )}

          {bottom && (
            <Link
              href={bottom.link || "#"}
              className="relative overflow-hidden rounded-xl group aspect-square md:aspect-auto"
            >
              <Image
                src={bottom.image}
                alt="Hero bottom right banner"
                fill
                priority
                sizes="(max-width: 768px) 50vw, 38vw"
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

