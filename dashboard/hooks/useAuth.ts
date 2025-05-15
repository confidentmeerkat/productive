import { authService, UserProfile } from '@/services/authService';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (username, password) => {
        try {
          set({ isLoading: true });
          const response = await authService.login({ username, password });
          set({
            token: response.access_token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => set({ user: null, token: null, isLoading: false }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
);

export default useAuth;
