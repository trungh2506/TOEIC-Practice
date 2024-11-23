"use client";
import PracticeCard from "@/components/practice-card";
import { Separator } from "@/components/ui/separator";
import { getAllToeicTest } from "@/lib/redux/features/toeic-test/toeicTestSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const listeningCards = [
  {
    id: 1,
    title: "Part 1",
    image: "/part-1.webp",
    type: "Mô Tả Hình Ảnh",
    description:
      "Bốn câu mô tả ngắn về một bức ảnh sẽ được nói chỉ một lần. Trong số bốn câu này, hãy chọn câu mô tả phù hợp nhất với bức ảnh.",
  },
  {
    id: 2,
    title: "Part 2",
    image: "/part-2.webp",
    type: "Hỏi Và Trả Lời",
    description:
      "Ba câu trả lời cho một câu hỏi hoặc một phát biểu sẽ được nói chỉ một lần. Hãy chọn câu trả lời phù hợp nhất cho câu hỏi đó.",
  },
  {
    id: 3,
    title: "Part 3",
    image: "/part-3.webp",
    type: "Đoạn Hội Thoại",
    description:
      "Các đoạn hội thoại giữa hai hoặc ba người sẽ chỉ được nghe một lần. Lắng nghe mỗi đoạn hội thoại và chọn câu trả lời phù hợp nhất cho câu hỏi. Mỗi đoạn hội thoại sẽ có ba câu hỏi.",
  },
  {
    id: 4,
    title: "Part 4",
    image: "/part-4.webp",
    type: "Bài Nói Chuyện",
    description:
      "Các bài nói ngắn như thông báo hoặc tường thuật sẽ chỉ được nghe một lần. Lắng nghe mỗi bài nói và chọn câu trả lời phù hợp nhất cho câu hỏi. Mỗi bài nói sẽ có ba câu hỏi.",
  },
];

const readingCards = [
  {
    id: 5,
    title: "Part 5",
    image: "/part-5.webp",
    type: "Hoàn thành câu",
    description:
      "Chọn câu trả lời đúng nhất trong bốn lựa chọn để hoàn thành câu.",
  },
  {
    id: 6,
    title: "Part 6",
    image: "/part-6.webp",
    type: "Hoàn Thành Đoạn Văn",
    description:
      "Chọn câu trả lời đúng nhất trong bốn lựa chọn (từ, cụm từ hoặc một câu) để hoàn thành đoạn văn. Mỗi đoạn văn có bốn câu hỏi.",
  },
  {
    id: 7,
    title: "Part 7",
    image: "/part-7.webp",
    type: "Đọc Hiểu",
    description:
      "Đọc một loạt các văn bản khác nhau và chọn câu trả lời đúng nhất trong bốn lựa chọn. Mỗi văn bản có nhiều câu hỏi.",
  },
];

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const { toeicTestList, currentPage, loading } = useSelector(
    (state: RootState) => state.toeicTest
  );
  useEffect(() => {
    dispatch(getAllToeicTest(currentPage));
  }, [dispatch, currentPage]);
  return (
    <div className="flex flex-col items-center sm:items-start gap-10">
      <div className="flex flex-col gap-5">
        <span className="text-4xl">Listening</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          {listeningCards.map((card: any, index: number) => (
            <PracticeCard
              selectedPart={card.id}
              key={index}
              title={card.title}
              type={card.type}
              description={card.description}
              image={card.image}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <span className="text-4xl">Reading</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          {readingCards.map((card: any, index: number) => (
            <PracticeCard
              selectedPart={card.id}
              key={index}
              title={card.title}
              type={card.type}
              description={card.description}
              image={card.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
