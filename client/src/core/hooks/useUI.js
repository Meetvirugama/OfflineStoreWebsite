import { create } from "zustand";

const useUIStore = create((set) => ({
  isGlobalLoading: false,
  activeRequests: 0,

  startLoading: () => set((state) => ({ 
    activeRequests: state.activeRequests + 1,
    isGlobalLoading: true 
  })),

  stopLoading: () => set((state) => {
    const newCount = Math.max(0, state.activeRequests - 1);
    return { 
      activeRequests: newCount,
      isGlobalLoading: newCount > 0 
    };
  }),

  // Manual reset in case of catastrophic failures
  resetLoading: () => set({ activeRequests: 0, isGlobalLoading: false })
}));

export default useUIStore;
