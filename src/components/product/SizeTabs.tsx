"use client";

import { useState } from "react";
import { sizeGuide, sizeGuideMasculino } from "@/data/store-settings";
import { SizeGuideTable } from "./SizeGuideTable";
import { cn } from "@/lib/utils";

export function SizeTabs() {
  const [tab, setTab] = useState<"feminino" | "masculino">("feminino");

  return (
    <div>
      <div className="mb-6 inline-flex border border-border">
        {(["feminino", "masculino"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-2 text-xs font-medium uppercase tracking-widest-xs",
              tab === t
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <SizeGuideTable rows={tab === "feminino" ? sizeGuide : sizeGuideMasculino} />
    </div>
  );
}
