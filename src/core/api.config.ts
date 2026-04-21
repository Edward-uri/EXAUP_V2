import axios from 'axios';
import { ENV } from './env.config'; 

export const STORAGE_KEYS = {
    ACCESS_TOKEN : "user_access_token",
    REFRESH_TOKEN: "user_refresh_token",
  USER: "user_data",
  SESSION_EXPIRED: "session_expired_flag",
  AUTH_SCOPE: "auth_scope",
  EGRESADO_ID: "egresado_session_id",
} as const;

export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
  console.log("[apiClient.interceptor.request]", {
    url: config.url,
    hasToken: !!token,
    tokenValue: token ? `${token.substring(0, 20)}...` : null,
  });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => {
    const requestUrl = String(response.config?.url ?? '').toLowerCase();
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');
    
    if (isAuthEndpoint) {
      console.log("[apiClient.interceptor.response] Auth endpoint response", {
        url: response.config.url,
        status: response.status,
        headers: response.headers,
        dataKeys: Object.keys(response.data),
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url ?? '').toLowerCase();
    const isAuthEndpoint =
      requestUrl.includes('/auth/staff/login') ||
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh');

    // En endpoints de autenticación no intentamos refresh para no ocultar 401 reales.
    if (error.response?.status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
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
          localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRED, '1');

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('session-expired'));
          }
          
          
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRED, '1');

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('session-expired'));
        }
        
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
    }

    return Promise.reject(error);
  }
);