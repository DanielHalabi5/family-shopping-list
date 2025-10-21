import axios from 'axios'
import type { apiAuthType } from './types';



const API_URL = import.meta.env.VITE_API_URL;


export async function signup({ email, password, name }: apiAuthType) {
  const res = await axios.post(`${API_URL}/auth/signup`, { email, password, name })
  return res.data;
}


export async function login({ email, password }: apiAuthType) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password })
  return res.data
}


