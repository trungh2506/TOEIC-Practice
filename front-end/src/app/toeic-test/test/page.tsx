import Question from "@/components/question";
import QuestionBoard from "@/components/question-board";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Page() {
  return (
    <div className="">
      <h1 className="sm:text-4xl text-xl mb-5 text-black">
        TOEIC FULL TEST 1 ETS 2024
      </h1>
      <div className="flex gap-2 mb-5 overflow-x-auto sm:overflow-x-hidden">
        <Button>Part 1</Button>
        <Button>Part 2</Button>
        <Button>Part 3</Button>
        <Button>Part 4</Button>
        <Button>Part 5</Button>
        <Button>Part 6</Button>
        <Button>Part 7</Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-5">
        <div className="overflow-y-auto h-auto">
          <Image
            className="shadow rounded-md"
            src="/135-138.png"
            width={1200}
            height={450}
            quality={100}
            alt="Carousel image 1"
          />
        </div>
        <div className="basis-2/3">
          <Question />
          <Question />
          <Question />
          <Question />
        </div>
        <div className="relative">
          <div className="sm:sticky sm:top-28">
            <QuestionBoard />
          </div>
        </div>
      </div>
      <Button className="mt-5">Tiếp theo</Button>
    </div>
  );
}
