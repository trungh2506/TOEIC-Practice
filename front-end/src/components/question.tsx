import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { AppDispatch, RootState } from "@/lib/store";
import { AccordionItem } from "@radix-ui/react-accordion";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addAnswer } from "@/lib/redux/features/user-answer/userAnswerSlice";

const ANSWER_LABELS = ["A", "B", "C", "D"];

interface QuestionProps {
  question_id: string;
  question_number: number;
  question_text: string;
  question_image?: string;
  question_audio: string;
  options: any[];
}

export default function Question({
  question_id,
  question_number,
  question_text,
  question_image,
  question_audio,
  options,
}: QuestionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { answers } = useSelector((state: RootState) => state.userAnswer);
  const handleValueChange = (value: string) => {
    // console.log(value);
    // console.log(question_id);
    dispatch(addAnswer({ question_id: question_id, selected_option: value }));
    // console.log(answers);
  };
  return (
    <div
      className="flex flex-col sm:flex-row gap-5 mb-5"
      id={question_number.toString()}
    >
      <div className="mt-3">
        <Button
          size={"icon"}
          className="text-white text-sm p-1 rounded-full bg-primary"
        >
          {question_number}
        </Button>
      </div>
      <div>
        {question_image && (
          <Image
            className="rounded-md mb-3"
            src={question_image}
            width={600}
            height={400}
            quality={100}
            alt="Carousel image 1"
          />
        )}

        {question_text ? (
          <Accordion defaultValue="item-1" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="quicksand-semibold">
                <span className="text-xl ">{question_text}</span>
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <RadioGroup
                  onValueChange={handleValueChange}
                  className="mt-3 ml-3 flex flex-col "
                >
                  {options.map((option, index) => {
                    if (option && option.length > 0) {
                      return (
                        <div className="flex items-center space-x-2 hover:text-primary">
                          <RadioGroupItem
                            value={ANSWER_LABELS[index]}
                            id={`option-${ANSWER_LABELS[index]}`}
                          />
                          <span>{options[index]}</span>
                        </div>
                      );
                    }
                  })}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <>
            <span>{question_text}</span>
            <RadioGroup
              onValueChange={handleValueChange}
              className="mt-3 ml-3 flex flex-col "
            >
              {options.map((option, index) => {
                if (option && option.length > 0) {
                  return (
                    <div className="flex items-center space-x-2 hover:text-primary">
                      <RadioGroupItem
                        value={ANSWER_LABELS[index]}
                        id={`option-${ANSWER_LABELS[index]}`}
                      />
                      <span>{options[index]}</span>
                    </div>
                  );
                }
              })}
            </RadioGroup>
          </>
        )}
        <Separator className="mt-5" />
      </div>
    </div>
  );
}
