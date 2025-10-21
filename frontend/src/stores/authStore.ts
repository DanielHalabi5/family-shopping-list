import { create } from 'zustand';

export type userType = {
    id: number,
    name: string,
    email: string,
    password: string,
    familyId: number
}


export type authType = {
    token: string | null,
    user: userType | null,
    setAuth: (token: string, user: userType) => void,
    clearAuth: () => void
}

const useAuthStore = create<authType>((set) => ({

    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
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