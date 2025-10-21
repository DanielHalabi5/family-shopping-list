import axios from 'axios'
import type { User } from './types';



const API_URL = import.meta.env.VITE_API_URL;


export async function signup({ email, password, name }: User) {
  const res = await axios.post(`${API_URL}/auth/signup`, { email, password, name })
  return res.data;
}


export async function login({ email, password }: User) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password })
  return res.data
}


