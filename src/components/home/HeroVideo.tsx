"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/context/AppDataContext";

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_IMAGES = [
  "/dentroloja1.jpeg",
  "/dentroloja2.jpeg",
  "/dentroloja3.jpeg",
  "/foraDaLoja.jpeg",
];

/** Varies the Ken Burns focal point per slide so the zoom never repeats identically. */
const ZOOM_ORIGINS = ["center", "25% 35%", "75% 60%", "35% 75%"];

const SLIDE_DURATION_MS = 6800;
const TRANSITION_DURATION_S = 1.9;

function HeroSlideshow({ name }: { name: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
        transition={{ duration: TRANSITION_DURATION_S, ease: EASE }}
        className="absolute inset-0"
      >
        <Image
          src={HERO_IMAGES[index]}
          alt={`Loja ${name}`}
          fill
          priority={index === 0}
          sizes="100vw"
          style={{ transformOrigin: ZOOM_ORIGINS[index % ZOOM_ORIGINS.length] }}
          className="animate-hero-slide-zoom object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export function HeroVideo() {
  const { settings } = useAppData();
  const { heroTitle, heroSubtitle, heroButtonLabel, name } = settings;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[92svh] min-h-[560px] w-full items-end overflow-hidden bg-black text-white"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 h-[120%]">
        <HeroSlideshow name={name} />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pb-20 text-center sm:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display text-2xl tracking-[0.3em] sm:text-3xl"
        >
          {name}
        </motion.p>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="font-display text-4xl leading-tight sm:text-6xl"
          >
            {heroTitle}
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="text-sm text-white/80 sm:text-base"
        >
          {heroSubtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        >
          <Link
            href="/colecao"
            className="mt-2 inline-flex items-center border border-white/70 px-8 py-3 text-xs font-medium uppercase tracking-widest-xs transition-colors hover:bg-white hover:text-black"
          >
            {heroButtonLabel}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest-xs text-white/70"
      >
        <span>Role para explorar</span>
        <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
