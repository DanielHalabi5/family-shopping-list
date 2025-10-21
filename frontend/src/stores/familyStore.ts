import { create } from 'zustand';
import { fetchFamilyMembers } from '../api';
import type { Family } from '../types';

type FamilyStoreType = {
    families: Family[];
    setFamilies: (families: Family[]) => void;
    addFamily: (family: Family) => void;
    fetchFamilies: (token: string) => Promise<void>;
}

const useFamilyStore = create<FamilyStoreType>((set) => ({
    families: [],
    setFamilies: (families) => set({ families }),
    addFamily: (family) => set((state) => ({ families: [family, ...state.families] })),

    fetchFamilies: async (token) => {
        const data = await fetchFamilyMembers(token);
        set({ families: data });
    },
}));

export default useFamilyStore; 