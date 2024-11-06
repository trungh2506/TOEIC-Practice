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
      "Four short statements regarding a photograph will be spoken only one time. Of these four statements, select the one. that best describes the photograph.",
  },
  {
    id: 2,
    title: "Part 2",
    image: "/part-2.webp",
    type: "Hỏi Và Trả Lời",
    description:
      "Three responses to one question or statement will be spoken only one time. Select the best response for the question.",
  },
  {
    id: 3,
    title: "Part 3",
    image: "/part-3.webp",
    type: "Đoạn Hội Thoại",
    description:
      "Conversations between two or three people will be spoken only one time. Listen to each conversation and select the best response for the question. There are three questions for each conversation.",
  },
  {
    id: 4,
    title: "Part 4",
    image: "/part-4.webp",
    type: "Bài Nói Chuyện",
    description:
      "Short talks such as announcements or narrations will be spoken only one time. Listen to each talk and select the best response for the question There are three questions for each talk.",
  },
];

const readingCards = [
  {
    id: 5,
    title: "Part 5",
    image: "/part-5.webp",
    type: "Hoàn thành câu",
    description:
      "Select the best answer of the four choices to complete the sentence.",
  },
  {
    id: 6,
    title: "Part 6",
    image: "/part-6.webp",
    type: "Hoàn Thành Đoạn Văn",
    description:
      "Select the best answer of the four choices (words, phrases, or a sentence) to complete the text. There are four questions for each text.",
  },
  {
    id: 7,
    title: "Part 7",
    image: "/part-7.webp",
    type: "Đọc Hiểu",
    description:
      "Read a range of different texts and select the best answer of the four choices. There are multiple questions for each text.",
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
