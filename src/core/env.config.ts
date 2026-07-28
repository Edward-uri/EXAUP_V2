export const ENV = {
  API_URL: import.meta.env.VITE_API_BASE_URL as string,
  APP_NAME: "Seguimiento UP",
  APP_VERSION: "1.0.0",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;