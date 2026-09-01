import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  school: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, school, access_token, refresh_token } = action.payload;
      state.user = user;
      state.school = school;
      state.token = access_token;
      state.refreshToken = refresh_token;
      state.isAuthenticated = true;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('erp_token', access_token);
        localStorage.setItem('erp_refresh_token', refresh_token);
        localStorage.setItem('erp_user', JSON.stringify(user));
        localStorage.setItem('erp_school', JSON.stringify(school));
      }
    },
    logout: (state) => {
      state.user = null;
      state.school = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_refresh_token');
        localStorage.removeItem('erp_user');
        localStorage.removeItem('erp_school');
      }
    },
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('erp_token');
        const user = localStorage.getItem('erp_user');
        const school = localStorage.getItem('erp_school');
        if (token && user) {
          state.token = token;
          state.refreshToken = localStorage.getItem('erp_refresh_token');
          state.user = JSON.parse(user);
          state.school = school ? JSON.parse(school) : null;
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setCredentials, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
