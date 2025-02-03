import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;
const axiosConfig = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosConfig;
