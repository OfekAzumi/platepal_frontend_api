import axios from 'axios';

const MY_SERVER = 'http://127.0.0.1:8000/dishes/';

export function Get_Dishes() {
  return axios.get(MY_SERVER);
}

export function Add_Dish(data: {
  unicode: string;
  name: string;
  price: number;
  description: string;
  category: number;
}) {
  return axios.post(MY_SERVER, data);
}

export function Update_Dish(data: {
  id: number;
  unicode: string;
  name: string;
  price: number;
  description: string;
  category: number;
}) {
  const updateUrl = `${MY_SERVER}${data.id}/`;
  return axios.put(updateUrl, data);
}

export function Delete_Dish(dishId: number) {
  const deleteUrl = `${MY_SERVER}${dishId}/`;
  return axios.delete(deleteUrl);
}
