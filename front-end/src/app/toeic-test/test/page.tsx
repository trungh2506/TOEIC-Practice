import Question from "@/components/question";
import QuestionTable from "@/components/question-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl mb-5 text-black">TOEIC FULL TEST 1 ETS 2024</h1>
      <div className="flex gap-2 mb-5">
        <Button>Part 1</Button>
        <Button>Part 2</Button>
        <Button>Part 3</Button>
        <Button>Part 4</Button>
        <Button>Part 5</Button>
        <Button>Part 6</Button>
        <Button>Part 7</Button>
      </div>
      <div className="flex flex-row justify-between gap-5">
        <div className="basis-2/3">
          <Question />
          <Question />
          <Question />
          <Question />
        </div>
        <div className="overflow-y-auto h-[600px]">
          <Image
            className="shadow rounded-md"
            src="/135-138.png"
            width={1000}
            height={450}
            quality={100}
            alt="Carousel image 1"
          />
        </div>
        <div className="relative">
          <div className="sticky top-20">
            <QuestionTable />
          </div>
        </div>
      </div>

      <Button className="mt-5">Tiếp theo</Button>
    </div>
  );
}
