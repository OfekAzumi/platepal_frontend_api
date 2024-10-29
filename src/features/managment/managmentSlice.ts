import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Login } from './managmentAPI';

export interface managmentState {
  username: string;
  password: string;
  token: string;
  logged: boolean;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: managmentState = {
  username: '',
  password: '',
  token: '',
  logged: false,
  status: 'idle'

};

export const managmentAsync = createAsyncThunk(
  'managment/Login',
  async (credentials: { username: string, password: string }) => {
    console.log(credentials)
    const response = await Login(credentials);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const managmentSlice = createSlice({
  name: 'managment',
  initialState,

  reducers: {
    logOut: (state) => {
      state.logged = false
      state.token = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(managmentAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        state.username = ((JSON.parse(atob(action.payload.access.split('.')[1]))).username)
        state.status = 'loading';
        state.token = action.payload.access
        state.logged = true
      });
  },
});

export const { logOut } = managmentSlice.actions;

export const selectLogged = (state: RootState) => state.managment.logged;
export const selectToken = (state: RootState) => state.managment.token;
export const selectStatus = (state: RootState) => state.login.status;
export const selectUserName = (state: RootState) => state.login.username;

export default managmentSlice.reducer;
