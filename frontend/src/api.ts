import axios from 'axios'
import type { User } from './types';



const API_URL = import.meta.env.VITE_API_URL;

function authHeader(token: string | null) {
  return { Authorization: `Bearer ${token}` };
}


export async function signup({ email, password, name }: User) {
  const res = await axios.post(`${API_URL}/auth/signup`, { email, password, name })
  return res.data;
}


export async function login({ email, password }: User) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password })
  return res.data
}


export async function fetchFamilyMembers(token: string) {
  const res = await fetch(`${API_URL}/family`, {
    headers: authHeader(token)
  });
  return res.json();
}

export async function createFamily(token: string, name: string) {
  const res = await axios.post(`${API_URL}/family/create`, name, { headers: authHeader(token) });
  return res.data;
}


export async function createJoinRequest(token: string, userId: string, familyId: string) {
  const res = await axios.post(`${API_URL}/request`, { userId, familyId }, { headers: authHeader(token) });
  return res.data;
}


export async function fetchCurrentList(token: string) {
  const res = await axios.get(`${API_URL}/shoppingList/current`, { headers: authHeader(token) });
  return res.data;
}

export async function fetchAllLists(token: string) {
  const res = await axios.get(`${API_URL}/shoppingList/all`, { headers: authHeader(token) });
  return res.data;
}


export async function createShoppingItem(token: string, name: string, quantity: number, listId: string) {
  const res = await axios.post(`${API_URL}/shoppingItem`, { name, quantity, listId }, { headers: authHeader(token) });
  return res.data;
}

export async function updateShoppingItem(token: string, id: string, updates: { name?: string; quantity?: number; purchased?: boolean; }) {
  const res = await axios.put(`${API_URL}/shoppingItem/${id}`, updates, { headers: authHeader(token) });
  return res.data;
}

export async function deleteShoppingItem(token: string, id: string) {
  const res = await axios.delete(`${API_URL}/shoppingItem/${id}`, { headers: authHeader(token) });
  return res.data;
}

export async function fetchShoppingItems(token: string, listId: string) {
  const res = await axios.get(`${API_URL}/shoppingItem/list/${listId}`, { headers: authHeader(token) });
  return res.data;
}