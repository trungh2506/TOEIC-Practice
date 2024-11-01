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
  filterByPart,
  getAllToeicTest,
  getPartToeicTest,
  getToeicTestById,
  increaseCurrentPart,
  setCurrentPage,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";

import parse from "html-react-parser";

const DURATION_TEST = 120 * 60;

export default function Page() {
  const [time, setTime] = useState(DURATION_TEST);
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentToeicTest, currentPart, filteredToeicTest } = useSelector(
    (state: RootState) => state.toeicTest
  );

  const handlePartButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonValue = event.currentTarget.value;
    dispatch(filterByPart(parseInt(buttonValue, 10)));
  };

  useEffect(() => {
    if (param?.toeic_test_id) {
      dispatch(getToeicTestById(param?.toeic_test_id)).then(() => {
        dispatch(filterByPart(1));
      });
    }
  }, [dispatch, param?.toeic_test_id, currentPart]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevState) => {
        if (prevState <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevState - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      <h1 className="sm:text-4xl text-xl mb-5 text-black">
        {currentToeicTest?.title}
      </h1>
      <div className="flex gap-2 mb-5 overflow-x-auto sm:overflow-x-hidden">
        <Button value="1" onClick={handlePartButtonClick}>
          Part 1
        </Button>
        <Button value="2" onClick={handlePartButtonClick}>
          Part 2
        </Button>
        <Button value="3" onClick={handlePartButtonClick}>
          Part 3
        </Button>
        <Button value="4" onClick={handlePartButtonClick}>
          Part 4
        </Button>
        <Button value="5" onClick={handlePartButtonClick}>
          Part 5
        </Button>
        <Button value="6" onClick={handlePartButtonClick}>
          Part 6
        </Button>
        <Button value="7" onClick={handlePartButtonClick}>
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
                  <h1>{passage.title}</h1>
                  {passage.images.map((image: any, imageIndex: number) => (
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
                          question_id={question.question_id}
                          question_number={question.question_number}
                          question_text={question.question_text}
                          question_image={
                            question.question_image
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest.title}/images/${question.question_image}`
                              : undefined
                          }
                          question_audio={question.question_audio}
                          options={question.options}
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
                  question_image={
                    question?.question_image
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest.title}/images/${question?.question_image}`
                      : undefined
                  }
                  question_audio={question?.question_audio}
                  options={question?.options}
                />
              );
            })}
        </div>

        <div className="relative">
          <div className="sm:sticky sm:top-28">
            <QuestionBoard
              minutes={`${Math.floor(time / 60)}`.padStart(2, "0")}
              second={`${time % 60}`.padStart(2, "0")}
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
