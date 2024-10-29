import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Add_Category, Get_Categories, Update_Category, Delete_Category } from './categoryAPI';

export interface categoryState {
  id?: number;
  unicode: string;
  name: string;
  categories: [{
    id: number;
    unicode: string;
    name: string;
  }];
}

const initialState: categoryState = {
  id: undefined,
  unicode: '',
  name: '',
  categories: [{
    id: -1, // (-1) represents zero data in categories
    unicode: '',
    name: ''
  }]
};

export const getCategoriesAsync = createAsyncThunk(
  'category/GetAll',
  async () => {
    const response = await Get_Categories();
    return response.data;
  }
);

export const addCategoryAsync = createAsyncThunk(
  'category/Add',
  async (data: { unicode: string; name: string }) => {
    const response = await Add_Category(data);
    return response.data;
  }
);

export const updateCategoryAsync = createAsyncThunk(
  'category/Update',
  async (data: {
    id: number,
    unicode: string,
    name: string
  }) => {
    const response = await Update_Category(data);
    console.log(response);
    return response.data;
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'category/Delete',
  async (categoryId: number) => {
    const response = await Delete_Category(categoryId);
    return response.data;
  }
);

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(getCategoriesAsync.rejected, (state, action) => {
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
      });
  },
});



export const selectId = (state: RootState) => state.category.id;
export const selectUnicode = (state: RootState) => state.category.unicode;
export const selectName = (state: RootState) => state.category.name;
export const selectCategories = (state: RootState) => state.category.categories;

export default categorySlice.reducer;
