import { create } from 'zustand';
import { fetchAllLists, fetchCurrentList } from '../api';
import type { List } from '../types';

type ListStoreType = {
    currentList: List[];
    lists: List[];
    setLists: (lists: List[]) => void;
    setCurrentList: (list: List[]) => void;
    fetchLists: (token: string) => Promise<void>;
    fetchCurrentList: (token: string) => Promise<void>;
}

const useListStore = create<ListStoreType>((set) => ({
    currentList: [],
    lists: [],
    setLists: (lists) => set({ lists }),
    setCurrentList: (list) => set({ currentList: list }),
    fetchLists: async (token) => {
        try {
            const data = await fetchAllLists(token);
            set({ lists: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.error('Error fetching lists:', error);
            set({ lists: [] });
        }
    },
    fetchCurrentList: async (token) => {
        try {
            const data = await fetchCurrentList(token);
            const currentListArray = Array.isArray(data) ? data : (data ? [data] : []);
            set({ currentList: currentListArray });
        } catch (error) {
            console.error('Error fetching current list:', error);
            set({ currentList: [] });
        }
    }
}));

export default useListStore;