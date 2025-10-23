import { create } from 'zustand';
import { deleteShoppingItem, fetchShoppingItems, updateShoppingItem } from '../api';
import type { ShoppingItem } from '../types';

type ShoppingItemStoreType = {
    items: ShoppingItem[];
    setItems: (items: ShoppingItem[]) => void;
    fetchItems: (token: string, listId: string) => Promise<void>;
    updateItem: (token: string, id: string, updates: { name?: string; quantity?: number; purchased?: boolean; }) => Promise<void>;
    deleteItem: (token: string, id: string) => Promise<void>;
}


const useListStore = create<ShoppingItemStoreType>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
    fetchItems: async (token, listId) => {
        const data = await fetchShoppingItems(token, listId);
        set({ items: data });
    },
    updateItem: async (token, id, updates) => {
        const data = await updateShoppingItem(token, id, updates);
        set((state) => ({ items: state.items.map(item => item.id === id ? data : item) }));
    },
    deleteItem: async (token, id) => {
        await deleteShoppingItem(token, id);
        set((state) => ({ items: state.items.filter(item => item.id !== id) }));
    }
}));

export default useListStore;