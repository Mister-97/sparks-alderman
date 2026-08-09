"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import { ChicagoStar } from "@/components/ChicagoStars";

const ROW_WORDS = ["SOUTH SHORE", "CALUMET HEIGHTS", "SOUTH CHICAGO", "SOUTH DEERING"];

// Roomy sections can spread the fade across percentages of their own height.
const WIDE_GRADIENT =
  "linear-gradient(180deg, #ffffff 0%, #ffffff 13%, #eef3f8 19%, #dae5ef 25%, #c2d3e3 31%, #a6bdd4 36%, #8aa6c2 40%, #6d8cad 44%, #3b5d80 47%, #2b4a6b 50%, #3b5d80 53%, #6d8cad 56%, #8aa6c2 60%, #a6bdd4 64%, #c2d3e3 69%, #dae5ef 75%, #eef3f8 81%, #ffffff 87%, #ffffff 100%)";

// Phones anchor it to a fixed distance from each edge so the ramp survives.
const NARROW_GRADIENT =
  "linear-gradient(180deg, #ffffff 0px, #eef3f8 16px, #c2d3e3 30px, #8aa6c2 44px, #2b4a6b 50%, #8aa6c2 calc(100% - 44px), #c2d3e3 calc(100% - 30px), #eef3f8 calc(100% - 16px), #ffffff 100%)";

function MarqueeRow({
  x,
  variant,
  source = ROW_WORDS,
}: {
  x: ReturnType<typeof useTransform<number, string>>;
  variant: "light" | "bold";
  source?: readonly string[];
}) {
  // Repeat enough times that short sources (a single phrase) still fill the row.
  const reps = Math.max(3, Math.ceil(12 / source.length));
  const words = Array.from({ length: reps }, () => source).flat();
  return (
    <div className="overflow-hidden bg-navy/95 py-2 sm:py-3 md:py-4">
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
        {[0, 1].map((half) => (
          // Words and stars are siblings sharing one gap, so each star sits
          // exactly halfway between the words on either side of it.
          <div
            key={half}
            className="flex shrink-0 items-center gap-5 sm:gap-8 md:gap-12 pr-5 sm:pr-8 md:pr-12"
          >
            {words.flatMap((word, i) => [
              <span
                key={`w${i}`}
                className={`font-display tracking-wide text-lg sm:text-2xl md:text-4xl lining-figures ${
                  variant === "bold"
                    ? "font-bold text-white/90"
                    : "font-normal text-white"
                }`}
              >
                {word}
              </span>,
              <ChicagoStar key={`s${i}`} className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-7 md:h-7" />,
            ])}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function WardMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.6,
  });

  // A phone scrolls the whole section past in far less screen travel, so the
  // rows cover much less ground per scroll than they do on desktop.
  const topEnd = isNarrow ? "-7%" : "-18%";
  const bottomStart = isNarrow ? "-22%" : "-30%";
  const bottomEnd = isNarrow ? "-17%" : "-12%";

  const xTop = useTransform(smooth, [0, 1], ["0%", topEnd]);
  const xMiddle = useTransform(smooth, [0, 1], ["0%", "0%"]);
  // Starts pre-shifted left so there is always content covering the viewport
  // as this row travels right.
  const xBottom = useTransform(smooth, [0, 1], [bottomStart, bottomEnd]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="relative py-10 sm:py-32 md:py-72">
        {/* Short sections need the fade anchored in pixels from each edge, or the
            percentage stops compress into a visible hard line. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{ background: NARROW_GRADIENT }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{ background: WIDE_GRADIENT }}
        />

        <div className="relative flex flex-col gap-[5px]">
          <MarqueeRow x={xTop} variant="light" />
          <MarqueeRow x={xMiddle} variant="bold" source={["CHICAGO"]} />
          <MarqueeRow x={xBottom} variant="light" source={["7TH WARD"]} />
        </div>

        <div className="pointer-events-none absolute left-[4%] sm:left-[6%] md:left-[12%] top-1/2 -translate-y-1/2 h-[190px] sm:h-[290px] md:h-[460px] aspect-[1194/1285]">
          <Image
            src="/images/ward-map-detail.png"
            alt="Chicago 7th Ward — South Shore, Calumet Heights, South Chicago and South Deering"
            width={1194}
            height={1285}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
