import { setAccessToken, clearAuth } from '../features/auth/authSlice.js';
import axiosInstance from './axios.js';

let timerId = null;

const readExp = (jwt) => {
  if (!jwt) return null;
  try {
    const base64 = jwt.split('.')[1];
    const json = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
};

const clearProactiveRefresh = () => {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
};

const scheduleProactiveRefresh = (store, token) => {
  clearProactiveRefresh();
  const exp = readExp(token);
  if (!exp) return;

  const nowSec = Math.floor(Date.now() / 1000);
  const secondsUntilExp = exp - nowSec;
  const ms = Math.max((secondsUntilExp - 60) * 1000, 5000);

  timerId = setTimeout(async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh');
      const newToken = res?.data?.accessToken;
      if (newToken) {
        store.dispatch(setAccessToken(newToken));
        scheduleProactiveRefresh(store, newToken);
      } else {
        store.dispatch(clearAuth());
      }
    } catch {
      store.dispatch(clearAuth());
    }
  }, ms);
};

export default scheduleProactiveRefresh;
