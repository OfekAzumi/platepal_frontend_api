import axios from 'axios';

const MY_SERVER = 'http://127.0.0.1:8000/categories/';

export function Get_Categories() {
  return axios.get(MY_SERVER);
}

export function Add_Category(data: { unicode: string; name: string }) {
  return axios.post(MY_SERVER, data);
}

export function Update_Category(data: {
  id: number,
  unicode: string,
  name: string
}) {
  const updateUrl = `${MY_SERVER}${data.id}/`;
  return axios.put(updateUrl, data);
}

export function Delete_Category(categoryId: number) {
  const deleteUrl = `${MY_SERVER}${categoryId}/`;
  return axios.delete(deleteUrl);
}
