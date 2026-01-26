import axios from 'axios';
import { axiosInstance } from './axios';
import {
  setAccessToken,
  clearAuth,
  selectAccessToken,
} from '../features/auth/authSlice';
import { scheduleProactiveRefresh } from '../features/auth/tokenScheduler';

let isRefreshing = false;
let waiters = [];
const REFRESH_TIMEOUT_MS = 15_000;

// Custom RTK Base Query
const axiosBaseQuery =
  ({ prepareHeaders } = {}) =>
  async (
    { url, method = 'get', data, params, headers },
    { getState, dispatch, endpoint, signal }
  ) => {
    const state = getState();
    const token = selectAccessToken(state);

    let finalHeaders = { ...(headers || {}) };
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
    if (typeof prepareHeaders === 'function') {
      const maybe = prepareHeaders(finalHeaders, {
        getState,
        dispatch,
        endpoint,
      });
      if (maybe && typeof maybe === 'object') finalHeaders = maybe;
    }

    try {
      const response = await axiosInstance.request({
        url,
        method,
        data,
        params,
        headers: finalHeaders,
        signal,
      });
      return { data: response.data };
    } catch (err) {
      const isAxios = axios.isAxiosError?.(err);
      const status = isAxios ? err?.response?.status : undefined;

      if (status === 401 && url.includes('/login')) {
        return {
          error: {
            status: 401,
            data: err?.response?.data ?? {
              message: 'Unauthorized',
            },
          },
        };
      }

      if (status !== 401) {
        const fallbackData = isAxios
          ? err?.response?.data
          : { message: err?.message || 'Request failed' };
        const code = isAxios
          ? status
          : err?.name === 'CanceledError'
            ? 'CANCELED'
            : 'FETCH_ERROR';
        return {
          error: {
            status: code || 'FETCH_ERROR',
            data: fallbackData,
          },
        };
      }

      const originalConfig = isAxios && err.config ? err.config : {};
      if (originalConfig._rtkqRetried) {
        dispatch(clearAuth());
        return {
          error: {
            status: 401,
            data: err?.response?.data ?? {
              message: 'Unauthorized',
            },
          },
        };
      }

      // If a refresh process is already running, do this:
      if (isRefreshing) {
        try {
          const freshToken = await withTimeout(
            new Promise((resolve, reject) => waiters.push({ resolve, reject })),
            REFRESH_TIMEOUT_MS
          );
          const retryConfig = {
            ...originalConfig,
            _rtkqRetried: true,
            headers: {
              ...(originalConfig.headers || {}),
              ...(freshToken ? { Authorization: `Bearer ${freshToken}` } : {}),
            },
            signal,
          };
          const retryRes = await axiosInstance.request(retryConfig);
          return { data: retryRes.data };
        } catch (refreshErr) {
          dispatch(clearAuth());
          return {
            error: {
              status: 401,
              data: refreshErr?.response?.data ?? {
                message: 'Unauthorized',
              },
            },
          };
        }
      }
      // If no refresh is happening, do this:
      isRefreshing = true;
      try {
        const newToken = await withTimeout(
          doRefresh({ getState, dispatch }, signal),
          REFRESH_TIMEOUT_MS
        );
        resolveWaiters(null, newToken);

        const retryConfig = {
          ...originalConfig,
          _rtkqRetried: true,
          headers: {
            ...(originalConfig.headers || {}),
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          },
          signal,
        };
        const retryRes = await axiosInstance.request(retryConfig);
        return { data: retryRes.data };
      } catch (refreshErr) {
        resolveWaiters(refreshErr, null);
        dispatch(clearAuth());
        return {
          error: {
            status: 401,
            data: refreshErr?.response?.data ?? {
              message: 'Unauthorized',
            },
          },
        };
      } finally {
        isRefreshing = false;
      }
    }
  };

function resolveWaiters(err, token) {
  waiters.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token)
  );
  waiters = [];
}

function withTimeout(
  promise,
  ms,
  errFactory = () => new Error('Refresh timed out')
) {
  let t;
  const timeout = new Promise(
    (_, reject) => (t = setTimeout(() => reject(errFactory()), ms))
  );
  return Promise.race([promise.finally(() => clearTimeout(t)), timeout]);
}

async function doRefresh(store, signal) {
  const res = await axiosInstance.post('/users/refresh', undefined, {
    signal,
    timeout: REFRESH_TIMEOUT_MS,
  });
  console.log(res);
  const newToken = res?.data?.data?.accessToken;
  if (!newToken) throw new Error('No accessToken in refresh response');
  console.log(newToken);
  store.dispatch(setAccessToken(newToken));
  // start/reschedule proactive refresh after any successful refresh
  scheduleProactiveRefresh(store, newToken);
  return newToken;
}

export default axiosBaseQuery;
