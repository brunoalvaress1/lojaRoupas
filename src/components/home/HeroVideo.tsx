"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useAppData } from "@/context/AppDataContext";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroVideo() {
  const { settings } = useAppData();
  const { heroVideoUrl, heroFallbackImage, heroTitle, heroSubtitle, heroButtonLabel, name } =
    settings;

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
        {heroVideoUrl ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={heroFallbackImage}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={heroFallbackImage}
            alt={`Interior da loja ${name}`}
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover"
          />
        )}
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
