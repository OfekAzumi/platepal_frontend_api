import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './features/login/Login';
import Managment from './features/managment/Managment';
import Home from './Home';
import OrderHome from './OrderHome';
import CategoryManagement from './features/category/CategoryManagement';
import EmployeesManagment from './features/employee/EmployeesManagment';
import Register from './features/register/Register';
import DishManagment from './features/dish/DishManagment';
import OrderDetails from './OrderDetails';
import CustomersManagment from './features/customer/CustomersManagment';
import OrderItems from './OrderItems';
import OrdersManagment from './features/order/OrdersManagment';
import Loading from './Loading';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='/' element={<Home />} />
            <Route path='/orderhome' element={<OrderHome />} />
            <Route path='/orderdetails' element={<OrderDetails />} />
            <Route path='/orderitems' element={<OrderItems />} />
            <Route path='/login' element={<Login />} />
            <Route path='/loading' element={<Loading />} />
            <Route path='/managment' element={<Managment />} >
              <Route path='/managment/login' element={<Login />} />
              <Route path='/managment/categories' element={<CategoryManagement />} />
              <Route path='/managment/employees' element={<EmployeesManagment />} />
              <Route path='/managment/register' element={<Register />} />
              <Route path='/managment/dishes' element={<DishManagment />} />
              <Route path='/managment/customers' element={<CustomersManagment />} />
              <Route path='/managment/orders' element={<OrdersManagment />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
