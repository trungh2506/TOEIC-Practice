/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.dropbox.com", "lh3.googleusercontent.com"], // Thêm domain của Dropbox
    remotePatterns: [
      {
        protocol: "https", // Sử dụng https thay vì http
        hostname: "www.dropbox.com", // Domain của Dropbox
        pathname: "/scl/fi/**", // Đường dẫn ảnh trong Dropbox (có thể thay đổi theo URL của bạn)
      },
      {
        protocol: "https", // Sử dụng https
        hostname: "lh3.googleusercontent.com", // Domain của Googleusercontent
        pathname: "/**", // Đường dẫn ảnh từ Googleusercontent
      },
    ],
  },
};

export default nextConfig;
