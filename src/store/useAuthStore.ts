import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthRole = 'ld_team' | 'trainee' | 'hr' | 'trainer';

export interface AuthUser {
  email: string;
  name: string;
  role: AuthRole;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'lx-auth', // key di localStorage
    },
  ),
);