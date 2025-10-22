import { create } from 'zustand';
import { createJoinRequest } from '../api';
import type { JoinRequest } from '../types';

type JoinRequestStoreType = {
    requests: JoinRequest[];
    setRequests: (requests: JoinRequest[]) => void;
    addRequest: (request: JoinRequest) => void;
    removeRequest: (id: number) => void;
    sendJoinRequest: (token: string, userId: number, familyId: number) => Promise<void>;
}

const useJoinRequestStore = create<JoinRequestStoreType>((set) => ({
    requests: [],
    setRequests: (requests) => set({ requests }),
    addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),
    removeRequest: (id) => set((state) => ({ requests: state.requests.filter((req) => req.id !== id) })),

    sendJoinRequest: async (token, userId, familyId) => {
        const res = await createJoinRequest(token, userId, familyId);
        set((state) => ({ requests: [...state.requests, res.request] }));
    },

}));

export default useJoinRequestStore;