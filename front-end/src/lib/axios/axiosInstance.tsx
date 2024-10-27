import axios, { AxiosError } from "axios";

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
    // console.log(token);
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
    // Kiểm tra nếu token hết hạn (có thể dựa vào mã lỗi)
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      if (originalRequest) {
        // Gửi yêu cầu để làm mới token
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
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
          // Xử lý nếu có lỗi trong khi làm mới token
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
