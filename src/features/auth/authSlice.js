import { createSlice } from '@reduxjs/toolkit';

const loadStateFromStorage = () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (accessToken && user) {
      return {
        accessToken,
        user: JSON.parse(user),
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from storage:', error);
  }
  return {
    accessToken: null,
    user: null,
  };
};

const initialState = loadStateFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload || {};
      
      if (typeof accessToken !== 'undefined') {
        state.accessToken = accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        } else {
          localStorage.removeItem('accessToken');
        }
      }
      
      if (typeof user !== 'undefined') {
        state.user = user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
    },
    setAccessToken: (state, action) => {
      const token = action.payload;
      state.accessToken = token || null;
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        // !!
        localStorage.removeItem('accessToken');
      }
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, setAccessToken, clearAuth } = authSlice.actions;

export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;

export const selectAuthStatus = (state) => !!state.auth.accessToken;
export const selectUserRole = (state) => state.auth.user?.role || null;

export default authSlice.reducer;