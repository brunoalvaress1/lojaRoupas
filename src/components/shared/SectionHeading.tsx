"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 flex items-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-8 origin-left bg-foreground/40"
            />
            <span className="text-xs uppercase tracking-widest-xs text-muted-foreground">
              {eyebrow}
            </span>
          </motion.div>
        )}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-4xl"
          >
            {title}
          </motion.h2>
        </div>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-2 max-w-md text-sm text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest-xs"
        >
          <span className="underline-offset-4 group-hover:underline">
            {action.label}
          </span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
