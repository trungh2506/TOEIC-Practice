"use client";
import Question from "@/components/question";
import QuestionBoard from "@/components/question-board";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/lib/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementTimer,
  filterByPart,
  getAllToeicTest,
  getPartToeicTest,
  getToeicTestById,
  increaseCurrentPart,
  setCurrentPage,
  setIsPractice,
  startTimer,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";

import parse from "html-react-parser";
import { clearCurrentUserAnswer } from "@/lib/redux/features/user-answer/userAnswerSlice";
import AnswerReview from "@/components/answer-review";

const DURATION_TEST = 120 * 60;

export default function Page() {
  const [activePart, setActivePart] = useState<string | null>("1");
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentToeicTest,
    currentPart,
    filteredToeicTest,
    timer,
    isTimerRunning,
  } = useSelector((state: RootState) => state.toeicTest);
  const { answers } = useSelector((state: RootState) => state.userAnswer);

  const handlePartButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonValue = event.currentTarget.value;
    dispatch(filterByPart(parseInt(buttonValue, 10)));
    setActivePart(buttonValue);
  };

  useEffect(() => {
    if (param?.toeic_test_id) {
      dispatch(getToeicTestById(param?.toeic_test_id)).then(() => {
        dispatch(filterByPart(1));
      });
      dispatch(startTimer(DURATION_TEST));
      dispatch(setIsPractice(false));
    }
  }, [dispatch, param?.toeic_test_id, currentPart]);

  ///Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000); // Giảm thời gian mỗi giây
    } else if (!isTimerRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, dispatch]);
  return (
    <div className="">
      <span className="sm:text-4xl text-xl mb-5">
        {currentToeicTest?.title}
      </span>
      <audio
        className="w-[500px]"
        autoPlay={true}
        controls
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest?.title}/audios/${currentToeicTest?.full_audio}`}
      />
      <div className="flex gap-2 mb-5 overflow-x-auto sm:overflow-x-hidden">
        <Button
          value="1"
          onClick={handlePartButtonClick}
          variant={activePart === "1" ? "default" : "outline"}
        >
          Part 1
        </Button>
        <Button
          value="2"
          onClick={handlePartButtonClick}
          variant={activePart === "2" ? "default" : "outline"}
        >
          Part 2
        </Button>
        <Button
          value="3"
          onClick={handlePartButtonClick}
          variant={activePart === "3" ? "default" : "outline"}
        >
          Part 3
        </Button>
        <Button
          value="4"
          onClick={handlePartButtonClick}
          variant={activePart === "4" ? "default" : "outline"}
        >
          Part 4
        </Button>
        <Button
          value="5"
          onClick={handlePartButtonClick}
          variant={activePart === "5" ? "default" : "outline"}
        >
          Part 5
        </Button>
        <Button
          value="6"
          onClick={handlePartButtonClick}
          variant={activePart === "6" ? "default" : "outline"}
        >
          Part 6
        </Button>
        <Button
          value="7"
          onClick={handlePartButtonClick}
          variant={activePart === "7" ? "default" : "outline"}
        >
          Part 7
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-5">
        <div className="flex flex-col">
          {filteredToeicTest?.passages &&
            filteredToeicTest?.passages.length > 0 &&
            filteredToeicTest?.passages.map((passage: any, index: number) => (
              <div
                key={`passage-${index}`}
                className="flex sm:flex-row flex-col gap-5 mb-10"
              >
                {/* Duyệt qua từng hình ảnh trong passage */}
                <div className="sm:w-[600px] w-auto">
                  <span className="text-xl">{passage.title}</span>
                  {/*Duyệt qua content nếu không thấy thì duyệt qua hình ảnh */}
                  {passage.content && (
                    <div className="border-primary border p-3">
                      {parse(passage.content)}
                    </div>
                  )}
                  {!passage.content &&
                    passage.images.map((image: any, imageIndex: number) => (
                      <Image
                        key={`passage-image-${imageIndex}`}
                        className="rounded-md mb-3"
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest.title}/images/${image}`}
                        width={600}
                        height={400}
                        quality={100}
                        alt={`Image for passage ${index}`}
                      />
                    ))}
                </div>

                {/* Duyệt qua từng câu hỏi trong passage */}
                {/* Lọc và hiển thị câu hỏi dựa trên question_number */}
                <div className="flex flex-col">
                  {passage.questions.map(
                    (questionNumber: number, questionIndex: number) => {
                      // Lấy chi tiết câu hỏi từ allQuestions dựa trên question_number
                      const question = [
                        ...(filteredToeicTest?.listening || []),
                        ...(filteredToeicTest?.reading || []),
                      ].find((q: any) => q.question_number === questionNumber);

                      // Chỉ hiển thị nếu tìm thấy câu hỏi
                      return question ? (
                        <Question
                          key={`question-${questionIndex}`}
                          question_id={question._id}
                          question_number={question.question_number}
                          question_text={question.question_text}
                          question_image={
                            question.question_image
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest.title}/images/${question.question_image}`
                              : undefined
                          }
                          correct_answer=""
                          question_audio={question.question_audio}
                          options={question.options}
                          isAnswerShowing={false}
                          script={""}
                          isPractice={false}
                        />
                      ) : null;
                    }
                  )}
                </div>
              </div>
            ))}

          {/* ------------------- */}

          {filteredToeicTest?.passages?.length == 0 &&
            [
              ...(filteredToeicTest?.listening || []),
              ...(filteredToeicTest?.reading || []),
            ].map((question: any, index: number) => {
              return (
                <Question
                  question_id={question._id}
                  key={`question-${question.question_number}-${index}`}
                  question_number={question?.question_number}
                  question_text={question?.question_text}
                  correct_answer=""
                  question_image={
                    question?.question_image
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest.title}/images/${question?.question_image}`
                      : undefined
                  }
                  question_audio={question?.question_audio}
                  options={question?.options}
                  isAnswerShowing={false}
                  script={""}
                  isPractice={false}
                />
              );
            })}
        </div>

        <div className="relative">
          <div className="sm:sticky sm:top-10">
            <QuestionBoard
              minutes={`${Math.floor(timer / 60)}`.padStart(2, "0")}
              second={`${timer % 60}`.padStart(2, "0")}
            />
          </div>
        </div>
      </div>
      {/* {currentPart <= 7 && (
        <Button
          className="mt-5"
          onClick={() => {
            dispatch(increaseCurrentPart());
            window.scrollTo(0, 0);
          }}
        >
          Tiếp theo
        </Button>
      )} */}
    </div>
  );
}
