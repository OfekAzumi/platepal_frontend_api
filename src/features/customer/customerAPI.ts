import axios from 'axios';

const MY_SERVER = 'http://127.0.0.1:8000/customers/';
const MY_SERVER_ORDERS = 'http://127.0.0.1:8000/orders/';


export function Get_Customers() {
  return axios.get(MY_SERVER);
}

export function Get_Customer_By_Phone(phone: string) {
  const getUrl = `${MY_SERVER}phone/${phone}/`;
  return axios.get(getUrl);
}

export function Get_Customer_By_Id(customerId: number) {
  const getUrl = `${MY_SERVER}${customerId}/`;
  return axios.get(getUrl);
}

export function Get_Customer_Orders(customerId: number) {
  const getUrl = `${MY_SERVER_ORDERS}${customerId}/`;
  return axios.get(getUrl);
}

export function Add_Customer(data: {
  unicode: string;
  phone: string;
  name: string;
  city: string;
  address: string;
  floor: string;
  apt: string;
  entry: string;
  notes: string;
}) {
  return axios.post(MY_SERVER, data);
}

export function Update_Customer(data: {
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
}) {
  const updateUrl = `${MY_SERVER}${data.id}/`;
  return axios.put(updateUrl, data);
}

export function Delete_Customer(customerId: number) {
  const deleteUrl = `${MY_SERVER}${customerId}/`;
  return axios.delete(deleteUrl);
}
