import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // ❌ DO NOT set Content-Type here
});

// Automatically attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 Axios decides Content-Type automatically
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
