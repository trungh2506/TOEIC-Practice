import Question from "@/components/question";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

interface QuestionProps {
  question_id: string;
  question_number: number;
  question_text: string;
  question_image?: string;
  question_audio: string;
  options: any[];
  correct_answer: string;
  isAnswerShowing: boolean;
  script: string;
}

export default function AnswerReview({
  question_id,
  question_number,
  question_text,
  question_image,
  question_audio,
  options,
  correct_answer,
  isAnswerShowing = true,
  script,
}: QuestionProps) {
  const { answers, currentUserAnswer } = useSelector(
    (state: RootState) => state.userAnswer
  );
  const { currentToeicTest } = useSelector(
    (state: RootState) => state.toeicTest
  );
  return (
    <Dialog>
      <DialogTrigger className="quicksand-regular hover:text-destructive cursor-pointer">{`[Chi Tiết]`}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đáp Án Chi Tiết</DialogTitle>
          <DialogDescription>
            <div>
              {currentToeicTest.passages.some((passage: any) =>
                passage.questions.includes(question_number)
              ) && (
                <div className="h-[300px] overflow-y-auto">
                  {currentToeicTest.passages
                    .filter((passage: any) =>
                      passage.questions.includes(question_number)
                    )
                    .map((passage: any, index: number) => (
                      <div key={index}>{parse(passage.content)}</div>
                    ))}
                </div>
              )}
              <Question
                question_id={question_id}
                question_number={question_number}
                question_text={question_text}
                question_audio={question_audio}
                options={options}
                question_image={question_image}
                correct_answer={correct_answer}
                isAnswerShowing={true}
                script={script}
                isPractice={false}
                defaultValue={correct_answer.split("(")[1]?.replace(")", "")}
                showResult={true}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
