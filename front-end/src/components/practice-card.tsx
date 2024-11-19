"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  filterByPart,
  setSelectedPart,
  setSelectedTimer,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";
import { clearAnswer } from "@/lib/redux/features/user-answer/userAnswerSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Description } from "@radix-ui/react-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PracticeCardProps {
  title: string;
  type: string;
  description: string;
  image: string;
  selectedPart: number;
}

const TIMER_LIST = [
  {
    index: 1,
    value: 6,
    description: "Part 1",
  },
  { index: 2, value: 25, description: "Part 2" },
  { index: 3, value: 39, description: "Part 3" },
  { index: 4, value: 30, description: "Part 4" },
  { index: 5, value: 30, description: "Part 5" },
  { index: 6, value: 16, description: "Part 6" },
  { index: 7, value: 54, description: "Part 7" },
];

export default function PracticeCard({
  title,
  image,
  description,
  selectedPart,
  type,
}: PracticeCardProps) {
  const [selectedToeicTest, setSelectedToeicTest] = useState("");
  const [selectedTime, setSelectedTime] = useState(-1);
  const { toeicTestList, currentPage, loading } = useSelector(
    (state: RootState) => state.toeicTest
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleActionButton = () => {
    console.log(`Người dùng chọn part ${selectedPart}`);
    console.log(
      `Người dùng chọn bài thi: ${selectedToeicTest} với thời gian làm bài là: ${selectedTime}`
    );
    dispatch(setSelectedPart(selectedPart));
    dispatch(setSelectedTimer(selectedTime));
    dispatch(clearAnswer());
    router.push(`/practice/test/${selectedToeicTest}`);
  };
  return (
    <Card className="w-[300px]">
      <Image
        className="rounded-t-md"
        src={image}
        width={400}
        height={300}
        quality={100}
        alt="Carousel image 1"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <CardContent className="quicksand-regular text-sm">
        <p className="text-base">{description}</p>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger>
            <span className="bg-primary p-2 rounded-sm text-sm text-foreground">
              Xem Chi Tiết
            </span>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-full">
            <AlertDialogHeader>
              <AlertDialogTitle>Danh sách bài thi</AlertDialogTitle>
              <AlertDialogDescription>
                Lựa chọn bài thi và thời gian làm bài
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-5">
              <div>
                <p>Danh sách bài thi</p>
                <Select
                  defaultValue={selectedToeicTest}
                  onValueChange={(value) => {
                    setSelectedToeicTest(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Danh sách bài thi" />
                  </SelectTrigger>
                  <SelectContent>
                    {toeicTestList.map((toeic_test, index: number) => {
                      return (
                        <SelectItem key={index} value={toeic_test._id}>
                          {toeic_test.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <p>Lựa chọn thời gian làm bài</p>
                <Select
                  disabled={!selectedToeicTest}
                  onValueChange={(value) => {
                    setSelectedTime(parseInt(value, 10));
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Thời gian làm bài" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMER_LIST.map((timer: any) => {
                      return (
                        <SelectItem
                          key={timer.index}
                          value={`${(timer.value * 60).toString()}`}
                        >
                          {timer.value} phút - {timer.description}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleActionButton}>
                Vào thi
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
