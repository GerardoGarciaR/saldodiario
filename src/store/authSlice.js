import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    session: null,
    initialized: false,
  },
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
    },
    setAuthInitialized(state, action) {
      state.initialized = action.payload;
    },
  },
});

export const { setSession, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
