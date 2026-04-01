"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IHeroCarouselItem } from "@/features/config/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroCarouselProps {
  items: IHeroCarouselItem[];
}

const HeroCarousel = ({ items }: HeroCarouselProps) => {
  return (
    <div className="hero-carousel-wrapper">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        loop
        speed={600}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        navigation={{
          prevEl: ".hero-prev-btn",
          nextEl: ".hero-next-btn",
        }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        className="hero-swiper"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="hero-slide">
            <Link href={item.buttonLink}>
              <div className="hero-slide-inner">
                <Image
                  src={item.image}
                  alt={item.button || "Hero slide"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                {/* Dark overlay */}
                <div className="hero-slide-overlay" />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation */}
      <button className="hero-nav-btn hero-prev-btn" aria-label="Previous slide">
        <ChevronLeft className="size-6" />
      </button>
      <button className="hero-nav-btn hero-next-btn" aria-label="Next slide">
        <ChevronRight className="size-6" />
      </button>

      {/* Pagination */}
      <div className="hero-pagination" />
    </div>
  );
};

export default HeroCarousel;
