import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

interface QuestionBoardProps {
  minutes: string;
  second: string;
}

export default function QuestionBoard({ minutes, second }: QuestionBoardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentToeicTest, currentPart, filteredToeicTest } = useSelector(
    (state: RootState) => state.toeicTest
  );

  return (
    <div className="border p-5 rounded-lg flex flex-col gap-5 items-center justify-center w-full sm:w-[200px]">
      <span className="text-xl text-black">Thời gian còn lại</span>
      <span className="text-primary text-4xl">
        {minutes}:{second}
      </span>
      <ScrollArea className="p-2 rounded-xl sm:h-[400px] h-full sm:w-[200px] w-full">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            size={"icon"}
            className="border-gray-300 hover:border-primary rounded-full"
            variant={"outline"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 rounded-full"
            variant={"default"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 hover:border-primary rounded-full"
            variant={"outline"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 rounded-full"
            variant={"default"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 hover:border-primary rounded-full"
            variant={"outline"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 rounded-full"
            variant={"default"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 hover:border-primary rounded-full"
            variant={"outline"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 rounded-full"
            variant={"default"}
          >
            1
          </Button>
          <Button
            size={"icon"}
            className="border-gray-300 hover:border-primary rounded-full"
            variant={"outline"}
          >
            1
          </Button>
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Button className="hover:text-secondary hover:bg-primary">
          Nộp bài
        </Button>
        <Button
          className=" text-white hover:text-red-500 hover:bg-white hover:border-red-500 hover:border-b"
          variant={"destructive"}
        >
          Thoát
        </Button>
      </div>
    </div>
  );
}
