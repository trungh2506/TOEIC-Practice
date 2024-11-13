// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3001",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.dropbox.com"], // Thêm domain của Dropbox
    remotePatterns: [
      {
        protocol: "https", // Sử dụng https thay vì http
        hostname: "www.dropbox.com", // Domain của Dropbox
        pathname: "/scl/fi/**", // Đường dẫn ảnh trong Dropbox (có thể thay đổi theo URL của bạn)
      },
    ],
  },
};

export default nextConfig;
