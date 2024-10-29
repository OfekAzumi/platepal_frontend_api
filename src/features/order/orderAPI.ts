import axios from 'axios';
import { orderDetails } from './orderSlice';

const MY_SERVER = 'http://127.0.0.1:8000/orders/';
const ORDER_DETAILS = 'http://127.0.0.1:8000/orderdetails/'
const PAYPAL = 'http://127.0.0.1:8000/api/payment/'


export function Get_Orders() {
  return axios.get(MY_SERVER);
}

export function Get_Order_Details(orderId: number) {
  const orderDetailsUrl = `${ORDER_DETAILS}${orderId}/`;
  return axios.get(orderDetailsUrl);
}

// {
//   "unicode": "10003",
//   "customer": 5,
//   "payment": "card",
//   "cart": [
//     {
//       "typecode": 0,
//       "quantity": 1,
//       "is_free": false,
//       "adjusted_price": 19,
//       "dishid": 1
//     },
//     {
//       "typecode": 0,
//       "quantity": 2,
//       "is_free": false,
//       "adjusted_price": 11,
//       "dishid": 3
//     }
//   ]
// }


export function Add_Order(data: {
  unicode: string;
  customer: number;
  payment: string;
  active: boolean;
  cart: orderDetails[]
}) {
  return axios.post(MY_SERVER, data);
}

export function Update_Order(data: {
  id: number;
  unicode: string;
  customer: number;
  payment: string;
  active: boolean;
  cart: orderDetails[]
}) {
  const updateUrl = `${MY_SERVER}${data.id}/`;
  return axios.put(updateUrl, data);
}

export function Delete_Order(orderId: number) {
  const deleteUrl = `${MY_SERVER}${orderId}/`;
  return axios.delete(deleteUrl);
}

export function Create_Paypal_Payment(data: { total: number; unicode: string }) {
  return axios.post(`${PAYPAL}create/`, data)
}

export function Execute_Paypal_Payment(data: { paymentId: string; payerId: string }) {
  return axios.post(`${PAYPAL}execute/`, data)
}