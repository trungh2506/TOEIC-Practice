import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function QuestionTable() {
  return (
    <div className="border p-5 rounded-lg flex flex-col gap-5 items-center justify-center ">
      <span className="text-2xl text-black">Thời gian còn lại</span>
      <span className="text-primary text-4xl">119:59</span>
      <ScrollArea className="p-2 rounded-xl h-[400px] w-[200px]">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            size={"icon"}
            className="border-gray-300 hover:border-primary rounded-full"
            variant={"outline"}
          >
            200
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
      <div className="flex gap-10">
        <Button
          className=" text-white hover:text-red-500 hover:bg-white hover:border-red-500 hover:border-b"
          variant={"destructive"}
        >
          Thoát
        </Button>
        <Button className="hover:text-secondary hover:bg-primary">
          Nộp bài
        </Button>
      </div>
    </div>
  );
}
