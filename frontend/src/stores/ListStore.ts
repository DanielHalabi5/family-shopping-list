import { create } from 'zustand';
import { fetchAllLists, fetchCurrentList } from '../api';
import type { List } from '../types';

type ListStoreType = {
    currentList: List[];
    lists: List[];
    setLists: (lists: List[]) => void;
    fetchLists: (token: string) => Promise<void>;
    fetchCurrentList: (token: string) => Promise<void>;
}


const useListStore = create<ListStoreType>((set) => ({
    currentList: [],
    lists: [],
    setLists: (lists) => set({ lists }),
    fetchLists: async (token) => {
        const data = await fetchAllLists(token);
        set({ lists: data });
    },
    fetchCurrentList: async (token) => {
        const data = await fetchCurrentList(token);
        set({ currentList: data });
    }
}));

export default useListStore;