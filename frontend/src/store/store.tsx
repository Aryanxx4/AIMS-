// store/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  // Additional fields
}

interface ZustandStore {
  user: User | null;
  token: string | null;
  isSignedIn: boolean;
  detailsFilled: boolean;
  isHydrated: boolean; // New flag to indicate if the store has been hydrated
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setDetailsFilled: (detailsFilled: boolean) => void;
  setHydrated: (state: boolean) => void; // Action to set the hydration status
}

export const useZustandStore = create<ZustandStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isSignedIn: false,
      detailsFilled: false,
      isHydrated: false, // Initialize as false
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setIsSignedIn: (isSignedIn) => set({ isSignedIn }),
      setDetailsFilled: (detailsFilled) => set({ detailsFilled }),
      setHydrated: (state) => set({ isHydrated: state }), // Define the action
    }),
    {
      name: 'zustand-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true); // Set isHydrated to true after rehydration
      },
    }
  )
);