import axios from "axios";

// CHANGE THIS to your actual backend URL
const API_URL = "http://localhost:5000"; 

export const api = axios.create({
  baseURL: API_URL,
});

// Automatically add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;