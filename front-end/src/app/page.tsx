import Question from "@/components/question";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchUserProfile } from "@/lib/redux/features/user/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { BookOpen, Leaf, MessageCircleMore, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-20">
      {/* Carousel */}
      <div>
        <div className="hidden sm:block absolute z-50 bottom-20 bg-zinc-500 rounded-md p-5 text-white w-1/3 opacity-80">
          <span className="text-4xl">TOEIC AREA</span>
          <p className="quicksand-light">
            Chào mừng bạn đến với khu vực luyện thi TOEIC! Nơi bạn có thể nâng
            cao kỹ năng nghe, đọc và làm bài thi thử, giúp bạn chuẩn bị tốt nhất
            cho kỳ thi TOEIC. Chúng tôi cung cấp các bài kiểm tra mô phỏng và
            tài liệu học tập chất lượng, hỗ trợ bạn đạt được mục tiêu cao nhất.
          </p>
        </div>
        <Carousel
          className="relative hidden sm:block"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="">
            <CarouselItem className="flex items-center justify-center">
              <Image
                className="shadow rounded-md"
                src="/carousel.jpg"
                width={1200}
                height={450}
                quality={100}
                alt="Carousel image 1"
              />
            </CarouselItem>
            <CarouselItem className="flex items-center justify-center">
              <Image
                className="rounded-md"
                src="/carousel.jpg"
                width={1200}
                height={450}
                quality={100}
                alt="Carousel image 1"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      {/* End Carousel  */}

      {/* About Us  */}
      <div className="flex flex-col sm:flex-row justify-between gap-20">
        <div className="basis-2/3 flex flex-col gap-2">
          <span className="text-2xl">About Us</span>
          <p className="quicksand-regular">
            Chúng tôi cung cấp một nền tảng luyện thi TOEIC chuyên nghiệp, giúp
            bạn chuẩn bị cho kỳ thi một cách hiệu quả và tự tin. Với các bài
            kiểm tra thử được thiết kế đặc biệt, bạn sẽ có cơ hội trải nghiệm
            môi trường thi thật, từ đó nâng cao khả năng và chiến lược làm bài.
            <br />
            Chúng tôi cam kết cung cấp những công cụ học tập chất lượng, giúp
            bạn vượt qua các thử thách trong kỳ thi TOEIC và đạt được kết quả
            cao nhất.
          </p>
          <div className="flex flex-row-reverse">
            <Button
              className="border-primary text-primary quicksand-bold hover:text-secondary hover:bg-primary"
              variant={"outline"}
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
        <Image
          className="basis-1/3 rounded-md"
          src="/carousel.jpg"
          width={400}
          height={300}
          quality={100}
          alt="Carousel image 1"
        />
      </div>

      {/* End About Us */}

      {/* TOEIC AREA ENGLISH  */}
      <div className="flex flex-col items-center justify-center gap-6">
        <span className="text-3xl text-center">TOEIC AREA ENGLISH</span>
        <p className="text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
          aspernatur aliquid alias, quisquam maiores dolores eum sunt quae eos
          nobis ipsam. Consequatur laborum earum, id voluptatem magnam vero
          animi illum?
        </p>
        <div className="flex items-center flex-col sm:flex-row gap-40 mt-20">
          <div className="flex flex-col items-center gap-10">
            <Leaf size={50} /> Tài liệu miễn phí
          </div>
          <div className="flex flex-col items-center gap-10">
            <BookOpen size={50} /> Luyện các kỹ năng
          </div>
          <div className="flex flex-col items-center gap-10">
            <UserRound size={50} /> Quản lý tài khoản
          </div>
          <div className="flex flex-col items-center gap-10">
            <MessageCircleMore size={50} /> Tư vấn miễn phí
          </div>
        </div>
      </div>
      {/* End TOEIC AREA ENGLISH */}

      {/* LAM BAI TOEIC TEST */}

      <div className="flex sm:flex-row flex-col justify-between gap-20">
        <div className="basis-2/3 flex flex-col gap-2">
          <span className=" text-2xl">Làm bài kiểm tra thử</span>
          <p className="quicksand-regular">
            Khám phá các bài kiểm tra TOEIC mô phỏng và kiểm tra khả năng của
            bạn. Đây là cơ hội tuyệt vời để đánh giá trình độ tiếng Anh của mình
            trước khi tham gia kỳ thi chính thức. Thực hành với các câu hỏi từ
            các chủ đề nghe và đọc, giúp bạn cải thiện kỹ năng làm bài nhanh
            chóng và hiệu quả.
          </p>
          <div className="flex flex-row-reverse">
            <Button
              className="border-primary text-primary quicksand-bold  hover:text-secondary hover:bg-primary"
              variant={"outline"}
              asChild
            >
              <Link href={"/toeic-test"}>Xem chi tiết</Link>
            </Button>
          </div>
        </div>
        <Image
          className="basis-1/3 rounded-md"
          src="/carousel.jpg"
          width={400}
          height={300}
          quality={100}
          alt="Carousel image 1"
        />
      </div>

      {/* END LAM BAI TOEIC TEST */}
    </div>
  );
}
