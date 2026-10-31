"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "cn";

type Slide = {
  title: string;
  description: string;
  image: string;
  tint: string;
};

const slides: Slide[] = [
  {
    title: "Borrow Effortlessly for 7 to 30 Days",
    description:
      "No subscription fees or complicated processes. Simply choose, request, and enjoy reading.",
    image: "/banner/library-2.jpg",
    tint: "bg-[#1c1550]/40",
  },
  {
    title: "Share Books & Connect With Readers",
    description:
      "Have extra books on your shelf? Add them to BookNook and let fellow bookworms enjoy them.",
    image: "/banner/library-1.jpg",
    tint: "bg-[#3a1b06]/40",
  },
  {
    title: "Discover Your Next Favorite Book",
    description:
      "Explore thousands of community-shared stories, bestsellers, and timeless classics today.",
    image: "/banner/library-3.jpg",
    tint: "bg-[#0a1730]/35",
  },
];

export default function Banner() {
  return (
    <section
      aria-label="Featured highlights"
      className="relative h-full w-full overflow-hidden max-sm:h-[520px] sm:h-[560px] lg:h-[610px]"
    >
      <h1 className="sr-only">BookNook online library</h1>

      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        className="banner-swiper h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title} className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${slide.image}")` }}
              aria-hidden="true"
            />
            <div
              className={cn("absolute inset-0", slide.tint)}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,26,0.96)_0%,rgba(8,13,26,0.84)_40%,rgba(8,13,26,0.45)_75%,rgba(8,13,26,0.35)_100%)]">
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,transparent_0%,rgba(6,10,20,0.35)_100%)]"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-5 sm:px-6 xl:px-8">
              <div className="w-full max-w-[660px] lg:ml-[17%]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#c79a3e]/70 bg-[#0a101e]/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8bd63] backdrop-blur-sm">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Welcome to BookNook
                </span>

                <h2 className="mt-6 max-w-[600px] text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[48px] lg:text-[52px]">
                  {slide.title}
                </h2>

                <p className="mt-5 max-w-[570px] text-[15px] leading-[1.7] text-[#c9d2e1] sm:text-[17px]">
                  {slide.description}
                </p>

                <Link
                  href="/books"
                  className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#f7bd1f] px-6 py-3.5 text-[15px] font-bold text-[#141c2d] shadow-[0_0_30px_rgba(247,189,31,0.3)] transition-colors hover:bg-[#ffcb38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7bd1f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220] sm:text-base"
                >
                  Browse Books
                  <ArrowRight
                    className="size-[18px] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
