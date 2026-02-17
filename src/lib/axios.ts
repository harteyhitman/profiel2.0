import axios from 'axios';

// Use same-origin /api proxy in both dev and production so the browser never calls the
// backend directly. This avoids CORS: the backend is only called from the Next.js server
// (app/api/[...path]/route.ts), which forwards to NEXT_PUBLIC_API_URL.
// Paths are /user, /login, etc.; proxy adds /api so requests hit backend .../api/user.
const apiUrl = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'https://api.bedieningenprofiel.nl').replace(/\/?$/, '') + (process.env.NEXT_PUBLIC_API_URL?.endsWith('/api') ? '' : '/api');

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in all requests
});

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress console errors for endpoints that may not exist or return expected errors
    const url = error.config?.url || '';
    const status = error.response?.status;
    const isUserEndpoint = url.includes('/user') && !url.includes('/users/');
    const shouldSuppressError =
      (url.includes('/churches/stats') && (status === 400 || status === 404)) ||
      (url.includes('/churches/my') && status === 403) ||
      (url.includes('/churches/my-churches') && status === 403) ||
      (url.includes('/teams/') && url.includes('/results') && status === 404) ||
      (url.includes('/users/') && url.includes('/teams') && status === 404) ||
      (url.includes('/users/') && url.includes('/profile') && status === 404) ||
      (isUserEndpoint && (status === 401 || status === 500));

    if (error.response?.status === 401) {
      // Unauthorized - clear user data only; do not auto-redirect to login
      // so that users can keep browsing public pages (e.g. About) when not logged in.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    } else if (!shouldSuppressError) {
      // Only log errors that aren't expected
      console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

