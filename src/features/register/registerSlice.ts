import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Register } from './registerAPI';

export interface registerState {
  username: string;
  password: string;
  status: string;
}

const initialState: registerState = {
  username: '',
  password: '',
  status: 'idle'

};


export const registerAsync = createAsyncThunk(
  'register/Register',
  async (credentials: { username: string, password: string }) => {
    try {
      console.log(credentials);
      const response = await Register(credentials);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const registerSlice = createSlice({
  name: 'register',
  initialState,

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.fulfilled, (state, action) => {
      })
      .addCase(registerAsync.rejected, (state, action) => {
      });
  },
});


export const selectStatus = (state: RootState) => state.register.status;

export default registerSlice.reducer;
