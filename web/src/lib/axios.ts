import axios from 'axios';
import { LoginDTO } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user: LoginDTO | null = JSON.parse(localStorage.getItem('user') || 'null');

  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error.response?.status === 401) {
    const user: LoginDTO | null = JSON.parse(localStorage.getItem('user') || 'null');

    // use the refresh token and make a request to the refresh token API and store the new access token

    // if (user?.refreshToken) {
    //   // make a request to the refresh token API
    //   // store the new access token
    //   // store the new refresh token
    //   const response = await axios.get(`${import.meta.env.VITE_API_URL}/authentication/${user?.refreshToken}`)
    //   localStorage.setItem('user', JSON.stringify(response?.data));
    //   // retry the original request with the new access token
    //   return api.request(error.config);
    // }
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;