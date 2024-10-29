import axios from "axios"

export function Login(credentials: { username: string, password: string }) {
  const MY_SERVER = 'http://127.0.0.1:8000/login/';
  return axios.post(MY_SERVER, credentials)
}
