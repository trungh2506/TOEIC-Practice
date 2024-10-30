"use client";
import Question from "@/components/question";
import QuestionBoard from "@/components/question-board";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/lib/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllToeicTest,
  getToeicTestById,
  setCurrentPage,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";

export default function Page() {
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentToeicTest, readingQuestions, listeningQuestions, passages } =
    useSelector((state: RootState) => state.toeicTest);

  useEffect(() => {
    if (param?.toeic_test_id) {
      dispatch(getToeicTestById(param?.toeic_test_id));
    }
  }, [dispatch, param?.toeic_test_id]);

  useEffect(() => {
    console.log("toeic test", currentToeicTest);
    console.log("reading", readingQuestions);
    console.log("passages", passages);
  }, [currentToeicTest, readingQuestions, passages]);
  return (
    <div className="">
      <h1 className="sm:text-4xl text-xl mb-5 text-black">
        {currentToeicTest?.title}
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
          {readingQuestions.map((question, index) => {
            return (
              <Question
                question_number={question?.question_number}
                question_text={question?.question_text}
                question_image={question?.question_image}
                question_audio={question?.question_audio}
                options={question?.options}
              ></Question>
            );
          })}
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
