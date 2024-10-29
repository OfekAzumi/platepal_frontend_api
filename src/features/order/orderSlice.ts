import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Get_Orders, Add_Order, Update_Order, Delete_Order, Get_Order_Details, Create_Paypal_Payment, Execute_Paypal_Payment } from './orderAPI';

export interface orderState {
  id?: number;
  unicode: string;
  createdTime: string;
  customer: number;
  payment: string;
  active: boolean;
  cart: orderDetails[]
  orders: [{
    id: number;
    unicode: string;
    createdTime: string;
    customer: number;
    payment: string;
    active: boolean;
  }]
}

export interface orderDetails {
  typecode: number;
  id: number;
  quantity: number;
  is_free: boolean;
  adjusted_price: number
}

const initialState: orderState = {
  id: undefined,
  unicode: '',
  customer: -1,
  createdTime: '',
  payment: '',
  active: false,
  cart: [{
    id: -1,
    typecode: -1,
    quantity: -1,
    adjusted_price: -1,
    is_free: false
  }],
  orders: [{
    id: -1, // (-1) represents zero data in categories
    unicode: '',
    createdTime: '',
    customer: -1,
    payment: '',
    active: false
  }]
};

export const getOrdersAsync = createAsyncThunk(
  'order/GetAll',
  async () => {
    const response = await Get_Orders();
    return response.data;
  }
);

export const getOrderDetailsAsync = createAsyncThunk(
  'order/GetDetails',
  async (orderId: number) => {
    const response = await Get_Order_Details(orderId);
    return response.data;
  }
);

export const addOrderAsync = createAsyncThunk(
  'order/Add',
  async (data: {
    unicode: string;
    customer: number;
    payment: string;
    active: boolean;
    cart: orderDetails[]
  }) => {
    const response = await Add_Order(data);
    return response.data;
  }
);

export const createPaypalPaymentAsync = createAsyncThunk(
  'order/PaypalCreate',
  async (data: {
    total: number;
    unicode: string;
  }) => {
    const response = await Create_Paypal_Payment(data);
    return response.data;
  }
);

export const executePaypalPaymentAsync = createAsyncThunk(
  'order/PaypalExecute',
  async (data: { paymentId: string; payerId: string }) => {
    const response = await Execute_Paypal_Payment(data);
    return response.data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  'order/Update',
  async (data: {
    id: number;
    unicode: string;
    customer: number;
    payment: string;
    active: boolean;
    cart: orderDetails[]
  }) => {
    const response = await Update_Order(data);
    console.log(response);
    return response.data;
  }
);

export const deleteOrderAsync = createAsyncThunk(
  'order/Delete',
  async (orderId: number) => {
    const response = await Delete_Order(orderId);
    return response.data;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      .addCase(getOrdersAsync.rejected, (state, action) => {
      })
      .addCase(getOrderDetailsAsync.fulfilled, (state, action) => {
      })
      .addCase(getOrderDetailsAsync.rejected, (state, action) => {
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
      })
      .addCase(addOrderAsync.rejected, (state, action) => {
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
      })
      .addCase(updateOrderAsync.rejected, (state, action) => {
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
      })
      .addCase(createPaypalPaymentAsync.fulfilled, (state, action) => {
      })
      .addCase(createPaypalPaymentAsync.rejected, (state, action) => {
      })
      .addCase(executePaypalPaymentAsync.fulfilled, (state, action) => {
      })
      .addCase(executePaypalPaymentAsync.rejected, (state, action) => {
      });
  },
});



export const selectOrders = (state: RootState) => state.order.orders;

export default orderSlice.reducer;
