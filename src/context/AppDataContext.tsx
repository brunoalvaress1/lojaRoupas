"use client";

import { createContext, useContext } from "react";
import type { Category, StoreSettings } from "@/types";

interface AppData {
  settings: StoreSettings;
  categories: Category[];
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({
  value,
  children,
}: {
  value: AppData;
  children: React.ReactNode;
}) {
  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
}
