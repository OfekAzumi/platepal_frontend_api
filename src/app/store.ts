import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import managmentReducer from '../features/managment/managmentSlice';
import categoryReducer from '../features/category/categorySlice';
import employeeReducer from '../features/employee/employeeSlice';
import registerReducer from '../features/register/registerSlice';
import dishReducer from '../features/dish/dishSlice';
import orderReducer from '../features/order/orderSlice';
import customerReducer from '../features/customer/customerSlice';
import cartReducer from '../features/cart/cartSlice';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    managment: managmentReducer,
    category: categoryReducer,
    employee: employeeReducer,
    register: registerReducer,
    dish: dishReducer,
    order: orderReducer,
    customer: customerReducer,
    cart: cartReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
