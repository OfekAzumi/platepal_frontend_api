import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { orderDetails } from '../order/orderSlice';

export interface cartState {
  cart: orderDetails[]
}

const initialState: cartState = {
  cart: [{
    typecode: -1,
    id: -1,
    quantity: -1,
    is_free: false,
    adjusted_price: -1
  }]
};


export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = [];
    },
    addToCart: (state, action) => {
      console.log('made it here');
      console.log(state.cart);
      console.log(action.payload);
      state.cart.push(action.payload)
      console.log(state.cart);
    },
  },
  extraReducers: (builder) => { },
});

export const { resetCart, addToCart } = cartSlice.actions;


export const selectCart = (state: RootState) => state.cart.cart;


export default cartSlice.reducer;
