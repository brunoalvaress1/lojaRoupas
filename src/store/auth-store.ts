import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StoreUser {
  name: string;
  email: string;
}

interface RegisteredUser extends StoreUser {
  password: string;
}

interface AuthState {
  currentUser: StoreUser | null;
  users: RegisteredUser[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (
    name: string,
    email: string,
    password: string
  ) => { ok: boolean; error?: string };
  logout: () => void;
}

/**
 * Mock, client-only auth for the pre-Supabase phase.
 * Credentials are persisted in localStorage only — replace with Supabase Auth
 * before going live.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!user) return { ok: false, error: "E-mail não encontrado." };
        if (user.password !== password) {
          return { ok: false, error: "Senha incorreta." };
        }
        set({ currentUser: { name: user.name, email: user.email } });
        return { ok: true };
      },
      register: (name, email, password) => {
        const exists = get().users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
          return { ok: false, error: "Este e-mail já possui cadastro." };
        }
        const user = { name, email, password };
        set((state) => ({
          users: [...state.users, user],
          currentUser: { name, email },
        }));
        return { ok: true };
      },
      logout: () => set({ currentUser: null }),
    }),
    {
      name: "lumina-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
