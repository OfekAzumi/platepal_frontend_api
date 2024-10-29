import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Get_Dishes, Add_Dish, Update_Dish, Delete_Dish } from './dishAPI';

export interface dishState {
  id?: number;
  unicode: string;
  name: string;
  price: number;
  description: string;
  category: number;
  dishes: [{
    id: number;
    unicode: string;
    name: string;
    price: number;
    description: string;
    category: number;
  }]
}

const initialState: dishState = {
  id: undefined,
  unicode: '',
  name: '',
  price: 0.0,
  description: '',
  category: 0,
  dishes: [{
    id: -1, // (-1) represents zero data in dishes
    unicode: '',
    name: '',
    price: 0.0,
    description: '',
    category: 0,
  }]
};

export const getDishesAsync = createAsyncThunk(
  'dish/GetAll',
  async () => {
    const response = await Get_Dishes();
    return response.data;
  }
);

export const addDishAsync = createAsyncThunk(
  'dish/Add',
  async (data: {
    unicode: string;
    name: string;
    price: number;
    description: string;
    category: number;
  }) => {
    const response = await Add_Dish(data);
    return response.data;
  }
);

export const updateDishAsync = createAsyncThunk(
  'dish/Update',
  async (data: {
    id: number;
    unicode: string;
    name: string;
    price: number;
    description: string;
    category: number;
  }) => {
    const response = await Update_Dish(data);
    console.log(response);
    return response.data;
  }
);

export const deleteDishAsync = createAsyncThunk(
  'dish/Delete',
  async (dishId: number) => {
    const response = await Delete_Dish(dishId);
    return response.data;
  }
);

export const dishSlice = createSlice({
  name: 'dish',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDishesAsync.fulfilled, (state, action) => {
        state.dishes = action.payload
      })
      .addCase(getDishesAsync.rejected, (state, action) => {
      })
      .addCase(addDishAsync.fulfilled, (state, action) => {
      })
      .addCase(addDishAsync.rejected, (state, action) => {
      })
      .addCase(updateDishAsync.fulfilled, (state, action) => {
      })
      .addCase(updateDishAsync.rejected, (state, action) => {
      })
      .addCase(deleteDishAsync.fulfilled, (state, action) => {
      })
      .addCase(deleteDishAsync.rejected, (state, action) => {
      });
  },
});



export const selectDishes = (state: RootState) => state.dish.dishes;


export default dishSlice.reducer;
