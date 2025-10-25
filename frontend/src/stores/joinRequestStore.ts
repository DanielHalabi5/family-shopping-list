import { create } from 'zustand';
import { approveJoinRequest, createJoinRequest, fetchRequests, rejectJoinRequest } from '../api';
import type { JoinRequest } from '../types';

type JoinRequestStoreType = {
    requests: JoinRequest[];
    setRequests: (requests: JoinRequest[]) => void;
    addRequest: (request: JoinRequest) => void;
    removeRequest: (id: string) => void;
    sendJoinRequest: (token: string, userId: string, familyId: string) => Promise<void>;
    fetchRequests: (token: string) => Promise<void>;
    approveRequest: (token: string, requestId: string) => Promise<void>;
    rejectRequest: (token: string, requestId: string) => Promise<void>;
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

    fetchRequests: async (token) => {
        const data = await fetchRequests(token);
        set({ requests: data });
    },


    approveRequest: async (token, requestId) => {
        await approveJoinRequest(token, requestId);
        set((state) => ({ requests: state.requests.filter((req) => req.id !== requestId) }));
    },

    rejectRequest: async (token, requestId) => {
        await rejectJoinRequest(token, requestId);
        set((state) => ({ requests: state.requests.filter((req) => req.id !== requestId) }));
    },

}));

export default useJoinRequestStore;