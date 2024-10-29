import axios from "axios"

export function Login(credentials: { username: string, password: string }) {
  const MY_SERVER = 'https://platepal-backend-render.onrender.com/login/';
  return axios.post(MY_SERVER, credentials)
}
