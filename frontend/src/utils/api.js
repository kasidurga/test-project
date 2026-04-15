import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ✅ Create single axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ✅ DB Config APIs
export const dbConfigApi = {
  getAll: (params = {}) => api.get("/admin/db-configs", { params }),
  getById: (id) => api.get(`/admin/db-configs/${id}`),
  create: (data) => api.post("/admin/db-configs", data),
  update: (id, data) => api.put(`/admin/db-configs/${id}`, data),
  delete: (id) => api.delete(`/admin/db-configs/${id}`),
};

// ✅ Query API (FIXED HERE)
export const queryApi = {
  runQuery: (query, configId) => {
    return api.post("/api/query/run", {
      query: query,
      config_id: configId,
    });
  },
};