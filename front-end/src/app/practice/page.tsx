"use client";
import PracticeCard from "@/components/toeic-card";
import { Separator } from "@/components/ui/separator";

const listeningCards = [
  {
    id: 1,
    title: "Part 1",
    image: "",
    type: "Mô Tả Hình Ảnh",
    description:
      "Four short statements regarding a photograph will be spoken only one time. Of these four statements, select the one. that best describes the photograph.",
  },
  {
    id: 2,
    title: "Part 2",
    image: "",
    type: "Hỏi Và Trả Lời",
    description:
      "Three responses to one question or statement will be spoken only one time. Select the best response for the question.",
  },
  {
    id: 3,
    title: "Part 3",
    image: "",
    type: "Đoạn Hội Thoại",
    description:
      "Conversations between two or three people will be spoken only one time. Listen to each conversation and select the best response for the question. There are three questions for each conversation.",
  },
  {
    id: 4,
    title: "Part 4",
    image: "",
    type: "Bài Nói Chuyện",
    description:
      "Short talks such as announcements or narrations will be spoken only one time. Listen to each talk and select the best response for the question There are three questions for each talk.",
  },
];

const readingCards = [
  {
    id: 5,
    title: "Part 5",
    image: "",
    type: "Hoàn thành câu",
    description:
      "Select the best answer of the four choices to complete the sentence.",
  },
  {
    id: 6,
    title: "Part 6",
    image: "",
    type: "Hoàn Thành Đoạn Văn",
    description:
      "Select the best answer of the four choices (words, phrases, or a sentence) to complete the text. There are four questions for each text.",
  },
  {
    id: 7,
    title: "Part 7",
    image: "",
    type: "Đọc Hiểu",
    description:
      "Read a range of different texts and select the best answer of the four choices. There are multiple questions for each text.",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center sm:items-start gap-10">
      <div className="flex flex-col gap-5">
        <span className="text-4xl">Listening</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          {listeningCards.map((card) => (
            <PracticeCard
              key={card.id}
              title={card.title}
              type={card.type}
              description={card.description}
              image={card.image}
              onClick={() => console.log(card.title)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <span className="text-4xl">Reading</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          {readingCards.map((card) => (
            <PracticeCard
              key={card.id}
              title={card.title}
              type={card.type}
              description={card.description}
              image={card.image}
              onClick={() => {
                console.log(card.title);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
