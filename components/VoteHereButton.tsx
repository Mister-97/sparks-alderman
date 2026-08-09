"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Sticky call to action that stays out of the way until the hero is behind you,
 * then rides along in the bottom corner down to the donate block.
 */
export default function VoteHereButton() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Roughly one hero's worth of scrolling.
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="/donate"
          className="group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 inline-flex items-center rounded-full bg-brand-red px-7 py-3.5 text-white text-sm font-bold tracking-wide shadow-xl shadow-navy/30 transition-colors duration-300 hover:bg-red-700"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          Donate
        </motion.a>
      )}
    </AnimatePresence>
  );
}
