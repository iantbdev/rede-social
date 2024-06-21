import axios from "axios";

export const sendRequest = axios.create({
  baseURL: "http://localhost:8800/api/",
  withCredentials: true,
});
