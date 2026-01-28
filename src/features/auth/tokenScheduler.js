import { setAccessToken, clearAuth } from './authSlice.js';
import { axiosInstance } from '../../api/axios';

let timerId = null;

function readExp(jwt) {
  if (!jwt) return null;
  try {
    const base64 = jwt.split('.')[1];
    const json = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

export function clearProactiveRefresh() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

export function scheduleProactiveRefresh(store, token) {
  clearProactiveRefresh();
  const exp = readExp(token);
  if (!exp) return;

  const nowSec = Math.floor(Date.now() / 1000);
  const secondsUntilExp = exp - nowSec;
  const ms = Math.max((secondsUntilExp - 60) * 1000, 5000);

  timerId = setTimeout(async () => {
    try {
      const res = await axiosInstance.post('/user/refresh');
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
}
