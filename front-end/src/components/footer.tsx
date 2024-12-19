import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="absolute flex flex-col sm:flex-row justify-center bg-primary p-12 text-white gap-5">
      <div>
        <p className="mt-5 quicksand-medium">
          Chào mừng bạn đến với <strong>Trang Web Luyện Thi TOEIC</strong> – nền
          tảng trực tuyến giúp bạn chuẩn bị cho kỳ thi TOEIC một cách hiệu quả
          và toàn diện. Với các bài tập mô phỏng, ngân hàng câu hỏi phong phú,
          và các công cụ luyện nghe, luyện đọc, chúng tôi cam kết mang đến trải
          nghiệm học tập tuyệt vời giúp bạn đạt điểm số cao nhất.
        </p>
      </div>
      <div className="border-b-2 sm:border-l-2"></div>
      <div className="flex flex-col justify-around gap-2">
        <div className="flex flex-row gap-5">
          <Phone />
          <span className="hidden sm:block">Liên hệ</span>
          <span>+84123456789</span>
        </div>
        <div className="flex flex-row gap-5">
          <MapPin />
          <span className="hidden sm:block">Địa chỉ</span>
          <span>Dong Da, Quy Nhon, Binh Dinh</span>
        </div>
        <div className="flex flex-row gap-5">
          <Mail />
          <span className="hidden sm:block">Email</span>
          <span>hantrung02@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
