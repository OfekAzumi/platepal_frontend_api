import axios from "axios"

export function Register(credentials: { username: string, password: string }) {
  const MY_SERVER = 'https://platepal-backend-render.onrender.com/register/';
  return axios.post(MY_SERVER, credentials)
}
