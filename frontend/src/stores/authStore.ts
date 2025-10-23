import { create } from 'zustand';
import type { User } from '../types';


export type authType = {
    token: string | null,
    user: User | null,
    setAuth: (token: string, user: User) => void,
    clearAuth: () => void
}

const useAuthStore = create<authType>((set) => ({

    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || "null") : null,
    setAuth: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token, user });
    },
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
    }
}))

export default useAuthStore;