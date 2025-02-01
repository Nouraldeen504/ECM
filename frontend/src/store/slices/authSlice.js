// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isAuthenticated: false,
    user: null
  },
  reducers: {
    setCredentials: {
      reducer(state, action) {
        state.token = action.payload.key;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      },
      prepare(data) {
        return { payload: data };
      }
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;