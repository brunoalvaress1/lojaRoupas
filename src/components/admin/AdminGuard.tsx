"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/admin-auth-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) return null;

  return <>{children}</>;
}
