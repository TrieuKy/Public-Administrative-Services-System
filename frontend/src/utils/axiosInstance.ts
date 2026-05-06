import axios from 'axios';

// Cấu hình base URL của backend
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: đính kèm accessToken ──────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: tự động refresh token khi hết hạn ────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Xử lý hàng đợi sau khi refresh xong (hoặc thất bại)
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không phải 401, hoặc đã retry rồi, bỏ qua
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Không refresh cho chính endpoint /auth/refresh để tránh loop vô tận
    if (originalRequest.url?.includes('/auth/refresh')) {
      logout();
      return Promise.reject(error);
    }

    // Nếu đang refresh, đưa request vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Bắt đầu refresh
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });
      const newAccessToken: string = data.data?.accessToken || data.accessToken;

      // Lưu token mới
      localStorage.setItem('token', newAccessToken);

      // Cập nhật header mặc định
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      // Xử lý hàng đợi đang chờ
      processQueue(null, newAccessToken);

      // Retry request gốc với token mới
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

