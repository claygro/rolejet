import axios from "axios";

const Connection = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
export default Connection;
