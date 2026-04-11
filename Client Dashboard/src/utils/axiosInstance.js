import axios from "axios";
import { store } from "../Redux/store";
import { logout } from "../Redux/user/userSlice";
import { persistor } from "../Redux/store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5555",
});

// Request interceptor — har request me token attach karo
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — 401 aaye to logout + login pe redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expire ho gaya — sab clear karo
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      store.dispatch(logout());
      await persistor.purge();
      // Hash router use ho raha hai isliye window.location
      window.location.replace("/#/");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
