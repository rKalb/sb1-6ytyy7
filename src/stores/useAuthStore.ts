import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserCreateInput } from '../types/user';
import { AuthService } from '../services/auth';
import { config } from '../config';

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (input: UserCreateInput) => Promise<void>;
}

const auth = new AuthService();

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const user = await auth.validateCredentials(email, password);
          if (!user) {
            throw new Error('Invalid credentials');
          }
          set({ user, loading: false });
        } catch (error) {
          set({ error: 'Failed to sign in', loading: false });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, error: null });
      },

      signUp: async (input: UserCreateInput) => {
        set({ loading: true, error: null });
        try {
          const user = await auth.createUser(input);
          set({ user, loading: false });
        } catch (error) {
          set({ error: 'Failed to create account', loading: false });
          throw error;
        }
      }
    }),
    {
      name: `${config.LOCAL_STORAGE_PREFIX}auth-storage`,
    }
  )
);