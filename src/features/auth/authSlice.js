import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload || {};
      if (typeof accessToken !== 'undefined') state.accessToken = accessToken;
      if (typeof user !== 'undefined') state.user = user;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload || null;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, setAccessToken, clearAuth } = authSlice.actions;

export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;

export const selectAuthStatus = (state) => !!state.auth.accessToken;
export const selectUserRole = (state) => state.auth.user?.role || null;

export default authSlice.reducer;
