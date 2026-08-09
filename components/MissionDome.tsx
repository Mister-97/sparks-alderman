"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Mission section with a red dome behind it. The dome is anchored by its own
 * bottom edge and scales up as the section scrolls through the viewport, so it
 * reads as a small arc that grows and rises.
 */
export default function MissionDome({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.5,
  });

  // Grows early — reaches full size well before the section is centred.
  const scale = useTransform(smooth, [0, 0.3], [0.5, 1]);
  const opacity = useTransform(smooth, [0, 0.08], [0, 1]);

  return (
    <section
      id="mission"
      ref={ref}
      className="relative overflow-hidden pt-24 md:pt-14 pb-[100px] md:pb-[160px]"
    >
      <motion.div
        aria-hidden="true"
        style={{
          scale,
          opacity,
          transformOrigin: "50% 100%",
          // Chicago flag light blue (#41B6E6).
          background:
            "linear-gradient(180deg, rgba(65,182,230,0.62) 0%, rgba(65,182,230,0.58) 20%, rgba(65,182,230,0.50) 35%, rgba(65,182,230,0.38) 48%, rgba(65,182,230,0.25) 60%, rgba(65,182,230,0.15) 70%, rgba(65,182,230,0.07) 80%, rgba(65,182,230,0.02) 90%, rgba(65,182,230,0) 100%)",
        }}
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-14 md:top-0 w-[155%] md:w-[128%] h-[520px] md:h-[780px] rounded-[50%]"
      />

      <div className="relative mx-auto max-w-3xl w-full px-6 text-center">
        {children}
      </div>

      {/* Skyline seated on the bottom edge of the section — blue silhouette on
          phones, the original white one from md up. */}
      <Image
        src="/images/skyline-blue.png"
        alt=""
        aria-hidden="true"
        width={1840}
        height={548}
        className="pointer-events-none absolute inset-x-0 -bottom-6 w-full h-auto select-none md:hidden"
      />
      <Image
        src="/images/skyline.png"
        alt=""
        aria-hidden="true"
        width={2062}
        height={294}
        className="pointer-events-none absolute inset-x-0 -bottom-px w-full h-auto select-none hidden md:block"
      />
    </section>
  );
}
