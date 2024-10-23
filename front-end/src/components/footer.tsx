import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <div className="absolute flex flex-col sm:flex-row bg-blue-400 p-12 text-white gap-5">
      <div>
        <span className="text-3xl quicksand-regular">TOEIC AREA LOGO</span>
        <p className="mt-5 quicksand-light">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut ipsa
          unde harum nam ipsum culpa recusandae, eligendi ea molestiae voluptate
          ad facere quaerat praesentium eius natus odio ducimus officiis
          consequatur.
        </p>
      </div>
      <div className="border-b-2 sm:border-l-2"></div>
      <div className="basis-1/2 flex flex-col justify-around gap-2">
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
