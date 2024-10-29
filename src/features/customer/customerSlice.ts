import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Get_Customers, Get_Customer_By_Id, Get_Customer_Orders, Get_Customer_By_Phone, Add_Customer, Update_Customer, Delete_Customer } from './customerAPI';

export interface customerState {
  id?: number;
  unicode: string;
  phone: string;
  name: string;
  city: string;
  address: string;
  floor: string;
  apt: string;
  entry: string;
  notes: string;
  customers: [{
    id: number;
    unicode: string;
    phone: string;
    name: string;
    city: string;
    address: string;
    floor: string;
    apt: string;
    entry: string;
    notes: string;
  }];
  orders_by_id: [{ id: number; }],
  customer_by_phone: {
    id: number;
    unicode: string;
    phone: string;
    name: string;
    city: string;
    address: string;
    floor: string;
    apt: string;
    entry: string;
    notes: string;
  }
}

const initialState: customerState = {
  id: undefined,
  unicode: '',
  phone: '',
  name: '',
  city: '',
  address: '',
  apt: '',
  floor: '',
  entry: '',
  notes: '',
  customers: [{
    id: -1,
    unicode: '',
    phone: '',
    name: '',
    city: '',
    address: '',
    apt: '',
    floor: '',
    entry: '',
    notes: '',
  }],
  orders_by_id: [{ id: -1 }],
  customer_by_phone: {
    id: -1,
    unicode: '',
    phone: '',
    name: '',
    city: '',
    address: '',
    apt: '',
    floor: '',
    entry: '',
    notes: '',
  }
};

export const getCustomersAsync = createAsyncThunk(
  'customer/GetAll',
  async () => {
    const response = await Get_Customers();
    return response.data;
  }
);

export const getCustomerByIdAsync = createAsyncThunk(
  'customer/GetCustomerById',
  async (customerId: number) => {
    const response = await Get_Customer_By_Id(customerId);
    return response.data;
  }
);

export const getCustomerByPhoneAsync = createAsyncThunk(
  'customer/GetByPhone',
  async (phone: string) => {
    const response = await Get_Customer_By_Phone(phone);
    return response.data;
  }
);

export const getCustomerOrdersAsync = createAsyncThunk(
  'customer/GetOrdersById',
  async (customerId: number) => {
    const response = await Get_Customer_Orders(customerId);
    return response.data;
  }
);

export const addCustomerAsync = createAsyncThunk(
  'customer/Add',
  async (data: {
    unicode: string;
    phone: string;
    name: string;
    city: string;
    address: string;
    floor: string;
    apt: string;
    entry: string;
    notes: string;
  }) => {
    const response = await Add_Customer(data);
    return response.data;
  }
);

export const updateCustomerAsync = createAsyncThunk(
  'customer/Update',
  async (data: {
    id: number;
    unicode: string;
    phone: string;
    name: string;
    city: string;
    address: string;
    floor: string;
    apt: string;
    entry: string;
    notes: string;
  }) => {
    const response = await Update_Customer(data);
    console.log(response);
    return response.data;
  }
);

export const deleteCustomerAsync = createAsyncThunk(
  'customer/Delete',
  async (customerId: number) => {
    const response = await Delete_Customer(customerId);
    return response.data;
  }
);

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomersAsync.fulfilled, (state, action) => {
        state.customers = action.payload
      })
      .addCase(getCustomersAsync.rejected, (state, action) => {
      })
      .addCase(getCustomerByIdAsync.fulfilled, (state, action) => {
      })
      .addCase(getCustomerByIdAsync.rejected, (state, action) => {
      })
      .addCase(getCustomerOrdersAsync.fulfilled, (state, action) => {
        state.orders_by_id = action.payload
      })
      .addCase(getCustomerOrdersAsync.rejected, (state, action) => {
      })
      .addCase(getCustomerByPhoneAsync.fulfilled, (state, action) => {
        state.customer_by_phone = action.payload
      })
      .addCase(getCustomerByPhoneAsync.rejected, (state, action) => {
        state.customer_by_phone = {
          id: -1,
          unicode: '',
          phone: '',
          name: '',
          city: '',
          address: '',
          apt: '',
          floor: '',
          entry: '',
          notes: '',
        }
      })
      .addCase(addCustomerAsync.fulfilled, (state, action) => {
      })
      .addCase(addCustomerAsync.rejected, (state, action) => {
      })
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
      })
      .addCase(updateCustomerAsync.rejected, (state, action) => {
      })
      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {
      })
      .addCase(deleteCustomerAsync.rejected, (state, action) => {
      });
  },
});



export const selectCustomers = (state: RootState) => state.customer.customers;
export const selectCustomerOrders = (state: RootState) => state.customer.orders_by_id;
export const selectCustomerByPhone = (state: RootState) => state.customer.customer_by_phone;


export default customerSlice.reducer;
