"use client";
import AnswerReview from "@/components/answer-review";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/store";
import { divide } from "lodash";
import { Check, CircleCheck, CircleMinus, CircleX, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function TestResult() {
  const router = useRouter();
  const { answers, currentUserAnswer } = useSelector(
    (state: RootState) => state.userAnswer
  );
  const { currentToeicTest } = useSelector(
    (state: RootState) => state.toeicTest
  );

  useEffect(() => {
    if (!currentUserAnswer) {
      alert("Bạn chưa làm bất kỳ bài thi nào, Vui lòng chọn bài thi trước!");
      router.push("/toeic-test");
    }
  }, []);
  return (
    <>
      {currentUserAnswer && (
        <div className="flex flex-col gap-5">
          <span className="text-4xl">Kết quả thi: </span>
          <div className="flex items-center sm:flex-row flex-col justify-center gap-10">
            <div className="flex flex-col w-[500px]">
              <div>
                Listening
                <div className="flex items-center gap-2">
                  <Progress
                    value={(currentUserAnswer?.listening_score / 495) * 100}
                  />
                  <span>{currentUserAnswer?.listening_score}/495</span>
                </div>
              </div>
              <div>
                Reading
                <div className="flex items-center gap-2">
                  <Progress
                    value={(currentUserAnswer?.reading_score / 495) * 100}
                  />
                  <span>{currentUserAnswer?.reading_score}/495</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">Tổng điểm</span>
              <div className="flex items-center justify-center flex-col border-2 border-primary rounded-full w-[150px] h-[150px]">
                <span className="text-5xl">
                  {currentUserAnswer?.total_score}
                </span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col items-center gap-5 justify-center">
            <div className="flex flex-col items-center justify-center border border-slate-300 rounded-2xl text-2xl p-5 w-[200px]">
              <Timer color="gray" size={40} />
              <span>
                {`${Math.floor(currentUserAnswer?.duration / 60)
                  .toString()
                  .padStart(2, "0")}:${(currentUserAnswer?.duration % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center border border-slate-300 rounded-2xl text-2xl p-5 w-[200px]">
              <CircleCheck color="green" size={40} />
              Câu đúng <span>{currentUserAnswer?.correct_answers}</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-slate-300 rounded-2xl text-2xl p-5 w-[200px]">
              <CircleX color="red" size={40} />
              Câu sai <span>{currentUserAnswer?.incorrect_answers}</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-slate-300 rounded-2xl text-2xl p-5 w-[200px]">
              <CircleMinus color="gray" size={40} />
              Chưa làm <span>{currentUserAnswer?.unanswered_answers}</span>
            </div>
          </div>
          <Separator />

          <span className="text-4xl">Chi tiết đáp án:</span>
          <div>
            <span className="text-xl">Listening</span>
            <div className="flex flex-col flex-wrap h-[1200px] gap-2">
              {currentToeicTest?.listening.map(
                (question: any, index: number) => {
                  const userAnswer = currentUserAnswer.answers.find(
                    (answer: any) => answer.question_id._id === question._id
                  );
                  return (
                    <div key={index} className="flex gap-1 items-center">
                      <Button size="icon">{question.question_number}</Button>
                      <span className="text-primary">
                        {question?.correct_answer}
                      </span>
                      {userAnswer ? (
                        <span
                          className={
                            question?.correct_answer.includes(
                              userAnswer.selected_option
                            )
                              ? `text-green-500`
                              : `text-red-500`
                          }
                        >
                          {userAnswer.selected_option}
                        </span>
                      ) : (
                        <span>Chưa trả lời</span>
                      )}
                      <AnswerReview
                        question_image={
                          question?.question_image
                            ? question?.question_image
                            : undefined
                        }
                        question_id={question._id}
                        question_number={question.question_number}
                        question_text={question.question_text}
                        question_audio={question.question_audio}
                        options={question.options}
                        correct_answer={question.correct_answer}
                        isAnswerShowing={false}
                        script={question?.script}
                      />
                    </div>
                  );
                }
              )}
            </div>
            <span className="text-xl">Reading</span>
            <div className="flex flex-col flex-wrap h-[1200px] gap-2">
              {currentToeicTest?.reading.map((question: any, index: number) => {
                const userAnswer = currentUserAnswer.answers.find(
                  (answer: any) => answer.question_id._id === question._id
                );
                return (
                  <div key={index} className="flex gap-1 items-center">
                    <Button size="icon">{question.question_number}</Button>
                    <span className="text-primary">
                      {question?.correct_answer}
                    </span>
                    {userAnswer ? (
                      <span
                        className={
                          question?.correct_answer.includes(
                            userAnswer.selected_option
                          )
                            ? `text-green-500`
                            : `text-red-500`
                        }
                      >
                        {userAnswer.selected_option}
                      </span>
                    ) : (
                      <span>Chưa trả lời</span>
                    )}
                    <AnswerReview
                      question_image={
                        question?.question_image
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${currentToeicTest.title}/images/${question?.question_image}`
                          : undefined
                      }
                      question_id={question._id}
                      question_number={question.question_number}
                      question_text={question.question_text}
                      question_audio={question.question_audio}
                      options={question.options}
                      correct_answer={question.correct_answer}
                      isAnswerShowing={false}
                      script={question?.script}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
