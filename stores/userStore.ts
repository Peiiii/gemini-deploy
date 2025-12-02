import { create } from 'zustand';

interface UserState {
  credits: number;
  userName: string;
  avatarUrl: string;
  actions: {
    addCredits: (amount: number) => void;
    spendCredits: (amount: number) => void;
  };
}

export const useUserStore = create<UserState>((set) => ({
  credits: 2450, // Initial seed amount for demo
  userName: 'Indie Hacker',
  avatarUrl: '', // Using CSS gradient in UI
  actions: {
    addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
    spendCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
  },
}));