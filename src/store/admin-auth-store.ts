import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AdminAuthState {
  isAuthenticated: boolean;
  adminName: string | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

/**
 * Mock, client-only admin auth for the pre-Supabase phase.
 * Demo credential only — replace with Supabase Auth + RLS before going live.
 * No public sign-up: admin accounts are provisioned by the store owner.
 */
export const ADMIN_DEMO_EMAIL = "admin@lumina.store";
export const ADMIN_DEMO_PASSWORD = "lumina123";

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminName: null,
      login: (email, password) => {
        if (
          email.toLowerCase() === ADMIN_DEMO_EMAIL &&
          password === ADMIN_DEMO_PASSWORD
        ) {
          set({ isAuthenticated: true, adminName: "Equipe LUMINA" });
          return { ok: true };
        }
        return { ok: false, error: "E-mail ou senha inválidos." };
      },
      logout: () => set({ isAuthenticated: false, adminName: null }),
    }),
    {
      name: "lumina-admin-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
