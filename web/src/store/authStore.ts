import { create } from 'zustand';
import {LoginDTO, User} from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));

export const useUser = () => {
  const userData: LoginDTO = JSON.parse(localStorage.getItem('user') || null);
  return { user: userData, isSignedIn: !!userData, isLoaded: true };
}