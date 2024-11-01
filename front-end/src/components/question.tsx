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
import { AccordionItem } from "@radix-ui/react-accordion";
import Image from "next/image";

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
  const handleValueChange = (value: string) => {
    console.log(value);
    console.log(question_id);
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
                <span className="text-xl text-black">{question_text}</span>
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <RadioGroup
                  onValueChange={handleValueChange}
                  className="mt-3 ml-3 flex flex-col "
                >
                  <div className="flex items-center space-x-2 hover:text-primary">
                    <RadioGroupItem value="A" id="option-a" />
                    <span>A. {options[0]}</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-primary">
                    <RadioGroupItem value="B" id="option-b" />
                    <span>B. {options[1]}</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-primary">
                    <RadioGroupItem value="C" id="option-c" />
                    <span>C. {options[2]}</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-primary">
                    <RadioGroupItem value="D" id="option-d" />
                    <span>D. {options[3]}</span>
                  </div>
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
              <div className="flex items-center space-x-2 hover:text-primary">
                <RadioGroupItem value="A" id="option-a" />
                <span>A. {options[0]}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary">
                <RadioGroupItem value="B" id="option-b" />
                <span>B. {options[1]}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary">
                <RadioGroupItem value="C" id="option-c" />
                <span>C. {options[2]}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-primary">
                <RadioGroupItem value="D" id="option-d" />
                <span>D. {options[3]}</span>
              </div>
            </RadioGroup>
          </>
        )}
        <Separator className="mt-5" />
      </div>
    </div>
  );
}
