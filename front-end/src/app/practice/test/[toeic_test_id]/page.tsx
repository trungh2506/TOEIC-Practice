"use client";

import QuestionBoard from "@/components/question-board";
import {
  decrementTimer,
  filterByPart,
  getToeicTestById,
  setIsPractice,
  startTimer,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import Image from "next/image";
import Question from "@/components/question";
import { useRouter } from "next/navigation";

export default function Page() {
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentToeicTest,
    currentPart,
    filteredToeicTest,
    timer,
    isTimerRunning,
    selectedPart,
    selectedTimer,
  } = useSelector((state: RootState) => state.toeicTest);
  const { answers } = useSelector((state: RootState) => state.userAnswer);
  const router = useRouter();
  useEffect(() => {
    if (param?.toeic_test_id) {
      dispatch(getToeicTestById(param?.toeic_test_id)).then(() => {
        dispatch(filterByPart(selectedPart));
      });
      dispatch(startTimer(selectedTimer));
      dispatch(setIsPractice(true));
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
    <>
      <div className="">
        <span className="sm:text-4xl text-xl mb-5">
          {currentToeicTest?.title} - Part {selectedPart}
        </span>
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
                          src={`${image}`}
                          width={600}
                          height={400}
                          quality={100}
                          alt={`Image for passage ${index}`}
                        />
                      ))}
                    {/* Hiển thị audio cho phần passage listening */}
                    {passage.audio && (
                      <div className="border-primary border rounded-full p-3 w-auto flex items-center justify-center">
                        <audio
                          className="w-full"
                          autoPlay={false}
                          controls
                          src={`${passage.audio}&raw=1`}
                        />
                      </div>
                    )}
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
                        ].find(
                          (q: any) => q.question_number === questionNumber
                        );

                        // Chỉ hiển thị nếu tìm thấy câu hỏi
                        return question ? (
                          <Question
                            defaultValue={
                              answers.find(
                                (answer) => answer.question_id === question._id
                              )?.selected_option || ""
                            }
                            key={`question-${questionIndex}`}
                            question_id={question._id}
                            question_number={question.question_number}
                            question_text={question.question_text}
                            question_image={
                              question.question_image
                                ? `${question.question_image}`
                                : undefined
                            }
                            correct_answer={question?.correct_answer}
                            question_audio={question.question_audio}
                            options={question.options}
                            isAnswerShowing={false}
                            script={question?.script}
                            isPractice={true}
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
                    defaultValue={
                      answers.find(
                        (answer) => answer.question_id === question._id
                      )?.selected_option || ""
                    }
                    question_id={question._id}
                    key={`question-${question.question_number}-${index}`}
                    question_number={question?.question_number}
                    question_text={question?.question_text}
                    correct_answer={question?.correct_answer}
                    question_image={
                      question?.question_image
                        ? `${question?.question_image}`
                        : undefined
                    }
                    question_audio={question?.question_audio}
                    options={question?.options}
                    isAnswerShowing={false}
                    script={question?.script}
                    isPractice={true}
                  />
                );
              })}
          </div>

          <div className="relative">
            <div className="sm:sticky sm:top-28">
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
    </>
  );
}
