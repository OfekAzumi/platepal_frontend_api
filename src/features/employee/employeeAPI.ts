import axios from 'axios';
import { hours } from './employeeSlice';

const MY_SERVER = 'http://127.0.0.1:8000/workers/';

export function Get_Employees() {
  return axios.get(MY_SERVER);
}

export function Add_Employee(data: {
  unicode: string;
  name: string;
  notes: string;
  permission: {
    shiftManager: boolean;
  };
  hours: hours[];
}) {
  return axios.post(MY_SERVER, data);
}

export function Update_Employee(data: {
  id: number,
  unicode: string;
  name: string;
  notes: string;
  permission: {
    shiftManager: boolean;
  };
  hours: hours[];
}) {
  const updateUrl = `${MY_SERVER}${data.id}/`;
  return axios.put(updateUrl, data);
}

export function Delete_Employee(emplyeeId: number) {
  const deleteUrl = `${MY_SERVER}${emplyeeId}/`;
  return axios.delete(deleteUrl);
}
