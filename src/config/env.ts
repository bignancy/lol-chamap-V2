export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  WS_URL: import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws',
  USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false',
} as const;
