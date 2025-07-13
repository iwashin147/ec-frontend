import { create } from 'zustand';

/**
 * User interface representing the authenticated user
 */
interface User {
  id: string;
  name: string;
  email: string;
}
/**
 * Auth state interface
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Zustand store for authentication state management
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
