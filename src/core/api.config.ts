import axios from 'axios';
import { ENV } from './env.config'; 

export const STORAGE_KEYS = {
    ACCESS_TOKEN : "user_access_token",
    REFRESH_TOKEN: "user_refresh_token",
    USER: "user_data"
} as const;

export const apiClient = axios.create({
  baseURL: ENV.API_URL,  
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Necesario para que el navegador envíe cookies (connect.sid) al backend
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${ENV.API_URL}/auth/refresh`, 
            { refreshToken }, 
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken); 
          
          if (newRefreshToken) {
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken); 
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);

        } catch (refreshError) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          
          
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        return Promise.reject(new Error('No refresh token available'));
      }
    }

    if (error.response?.status === 403) {
    }

    return Promise.reject(error);
  }
);