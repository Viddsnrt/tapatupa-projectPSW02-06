import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', // Sesuaikan jika beda
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Penting jika pakai Sanctum untuk cookie-based auth
});

// Interceptor untuk menambahkan token Auth (jika menggunakan Sanctum)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); // atau dari context/state management
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Opsional: Interceptor respons untuk error handling global
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // Arahkan ke halaman login, misalnya:
      // window.location.href = '/login';
      // Atau jika menggunakan React Router, gunakan hook navigate di komponen yang lebih tinggi
      console.error("Unauthorized access - 401. Redirecting to login might be needed.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;