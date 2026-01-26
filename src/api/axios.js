import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

if (
  typeof window !== 'undefined' &&
  import.meta.env?.NODE_ENV === 'development'
) {
  axiosInstance.interceptors.request.use((config) => {
    console.debug(
      '[axios request]: ',
      config.method?.toUpperCase(),
      config.baseURL + config.url,
      {
        params: config.params,
        hasBody: Boolean(config.data),
      }
    );
    return config;
  });
  axiosInstance.interceptors.response.use(
    (res) => {
      console.debug('[axios response]: ', res.status, res.config.url);
      return res;
    },
    (error) => {
      console.debug(
        '[axios error]: ',
        error?.response?.status ?? error?.code,
        error?.config?.url
      );
      return Promise.reject(error);
    }
  );
}
