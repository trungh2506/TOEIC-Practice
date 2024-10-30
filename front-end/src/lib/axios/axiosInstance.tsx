import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

function getCookie(name: string): string | undefined {
  const cookieMatch = document.cookie.match(
    "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return cookieMatch ? cookieMatch.pop() : undefined;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("jwt");
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      if (originalRequest) {
        // Lấy token từ cookie
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="));
        const token = cookie ? cookie.split("=")[1] : null;

        if (!token) {
          // Xử lý khi không có token
          console.error("No token found, redirecting to login...");
          // Redirect to login or show an error message
          return Promise.reject(error);
        }

        // Giải mã token và kiểm tra thời gian hết hạn
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken?.exp
          ? decodedToken.exp * 1000 < Date.now()
          : true;

        if (!isExpired) {
          // Nếu token chưa hết hạn, tiếp tục gọi lại yêu cầu
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }

        // Gửi yêu cầu để làm mới token
        try {
          const response = await axios.post(
            `${process.env.NEST_PUBLIC_API_BASE_URL}/auth/refresh`,
            {},
            {
              withCredentials: true, // Cho phép gửi cookie
            }
          );
          const { access_token } = response.data;

          // Lưu access token mới vào cookie
          document.cookie = `jwt=${access_token}; path=/; secure; samesite=strict; max-age=${
            60 * 60 * 24 * 7
          }`; // Cookie sẽ tồn tại trong 7 ngày

          // Cập nhật header Authorization cho yêu cầu ban đầu
          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

          return axiosInstance(originalRequest); // Gửi lại yêu cầu ban đầu
        } catch (err) {
          console.error("Error refreshing token:", err);
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
