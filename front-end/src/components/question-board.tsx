import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

import {
  filterByPart,
  getAllToeicTest,
  getPartToeicTest,
  getToeicTestById,
  increaseCurrentPart,
  setCurrentPage,
  navigateToSelectedQuestion,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SubmitAlertDialog from "@/components/sumbit-alert-dialog";
import { Progress } from "@/components/ui/progress";

interface QuestionBoardProps {
  minutes: string;
  second: string;
}

// Định nghĩa kiểu cho props của MemoizedButton
interface MemoizedButtonProps {
  value: number;
  isAnswered: boolean;
  isMarked: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Tạo MemoizedButton
const MemoizedButton = React.memo(
  ({ isAnswered, isMarked, value, onClick }: MemoizedButtonProps) => (
    <Button
      onClick={onClick}
      size={"icon"}
      variant={isMarked ? "destructive" : isAnswered ? "default" : "outline"}
      value={value}
    >
      {value}
    </Button>
  )
);

// Tạo ButtonQuestionList với React.memo
const ButtonQuestionList = React.memo(
  ({
    fromQuestion,
    toQuestion,
    onButtonClick,
    questionNumberList,
    markedQuestions,
  }: {
    fromQuestion: number;
    toQuestion: number;
    questionNumberList: number[];
    markedQuestions: number[];
    onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }) => {
    const buttons = [];
    for (let i = fromQuestion; i <= toQuestion; i++) {
      // Kiểm tra nếu questionNumberList có i
      const isAnswered = questionNumberList.includes(i);
      const isMarked = markedQuestions.includes(i);
      buttons.push(
        <MemoizedButton
          isMarked={isMarked}
          isAnswered={isAnswered}
          onClick={onButtonClick}
          value={i}
          key={i} // Đảm bảo key là duy nhất
        />
      );
    }
    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {buttons}
      </div>
    );
  }
);

export default function QuestionBoard({ minutes, second }: QuestionBoardProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentToeicTest, currentPart, filteredToeicTest, isPractice } =
    useSelector((state: RootState) => state.toeicTest);
  const { answers, questionNumberList, markedQuestions } = useSelector(
    (state: RootState) => state.userAnswer
  );

  const handleQuestionButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const questionNumber = parseInt(event.currentTarget.value, 10);
    dispatch(navigateToSelectedQuestion(questionNumber));

    router.push(`#${questionNumber}`);
    const section = document.getElementById(questionNumber.toString());
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
    console.log(`câu hỏi số ${event.currentTarget.value}`);
  };

  return (
    <div className="border p-5 rounded-lg flex flex-col gap-5 items-center justify-center w-full sm:w-[200px]">
      <span className="text-xl">Thời gian còn lại</span>
      <span className="text-red-500 text-4xl">
        {minutes}:{second}
      </span>
      <div className="w-[150px] flex flex-col items-center">
        {answers.length}/200
        <Progress value={answers.length} />
      </div>
      <div className="text-foreground">
        Chú ý: Bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu
        review
      </div>
      <ScrollArea className="p-2 rounded-xl sm:h-[400px] h-full sm:w-[200px] w-full">
        <ButtonQuestionList
          questionNumberList={questionNumberList}
          markedQuestions={markedQuestions}
          fromQuestion={
            !isPractice
              ? 1
              : filteredToeicTest?.listening.length > 0 &&
                filteredToeicTest?.listening[0].question_number
              ? filteredToeicTest?.listening[0].question_number
              : filteredToeicTest?.reading.length > 0 &&
                filteredToeicTest?.reading[0].question_number
              ? filteredToeicTest?.reading[0].question_number
              : 1
          }
          toQuestion={
            !isPractice
              ? 200
              : filteredToeicTest?.listening?.length > 0 &&
                filteredToeicTest?.listening[
                  filteredToeicTest.listening.length - 1
                ]?.question_number
              ? filteredToeicTest?.listening[
                  filteredToeicTest.listening.length - 1
                ]?.question_number
              : filteredToeicTest?.reading?.length > 0 &&
                filteredToeicTest?.reading[filteredToeicTest.reading.length - 1]
                  ?.question_number
              ? filteredToeicTest?.reading[filteredToeicTest.reading.length - 1]
                  ?.question_number
              : 1
          }
          onButtonClick={handleQuestionButtonClick}
        />
      </ScrollArea>
      <div className="flex gap-2">
        <SubmitAlertDialog />
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
