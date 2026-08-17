"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET = 32;

function getVariants(
  direction: Direction,
  distance: number,
  delay: number
): Variants {
  const offset: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  return {
    hidden: { opacity: 0, ...offset[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
    },
  };
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  distance = OFFSET,
  className,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={getVariants(direction, distance, delay)}
    >
      {children}
    </motion.div>
  );
}
