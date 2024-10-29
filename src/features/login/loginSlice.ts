import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Login } from './loginAPI';

export interface LoginState {
  username: string;
  password: string;
  token: string;
  logged: boolean;
  status: string;
}

const initialState: LoginState = {
  username: '',
  password: '',
  token: '',
  logged: false,
  status: 'idle'

};


export const loginAsync = createAsyncThunk(
  'login/Login',
  async (credentials: { username: string, password: string }) => {
    try {
      console.log(credentials);
      const response = await Login(credentials);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,

  reducers: {
    logOut: (state) => {
      state.logged = false
      state.token = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        if (action.payload.name == 'AxiosError') {
          console.log(action.payload);
          state.status = 'Incorrect username or password. Please try again.';
          state.logged = false
        } else {
          console.log(action.payload);
          state.username = ((JSON.parse(atob(action.payload.access.split('.')[1]))).username)
          state.status = 'idle';
          state.token = action.payload.access
          state.logged = true
        }
      });
  },
});

export const { logOut } = loginSlice.actions;

export const selectLogged = (state: RootState) => state.login.logged;
export const selectToken = (state: RootState) => state.login.token;
export const selectStatus = (state: RootState) => state.login.status;
export const selectUserName = (state: RootState) => state.login.username;

export default loginSlice.reducer;
