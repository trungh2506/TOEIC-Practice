import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface QuestionProps {
  question_number: number;
  question_text: string;
  question_image: string;
  question_audio: string;
  options: any[];
}

export default function Question({
  question_number,
  question_text,
  question_image,
  question_audio,
  options,
}: QuestionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 mb-5">
      <div className="mt-3">
        <Button
          size={"icon"}
          className="text-white text-sm p-1 rounded-full bg-primary"
        >
          {question_number}
        </Button>
      </div>
      <div>
        <Image
          className="rounded-md mb-3"
          src="/1.png"
          width={700}
          height={400}
          quality={100}
          alt="Carousel image 1"
        />
        <span>{question_text}</span>
        <RadioGroup className="mt-3 ml-3 flex flex-col ">
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-a" id="option-a" />
            <Label htmlFor="option-a">A. {options[0]}</Label>
          </div>
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-b" id="option-b" />
            <Label htmlFor="option-b">B. {options[1]}</Label>
          </div>
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-c" id="option-c" />
            <Label htmlFor="option-c">C. {options[2]}</Label>
          </div>
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-d" id="option-d" />
            <Label htmlFor="option-d">D. {options[3]}</Label>
          </div>
        </RadioGroup>
        <Separator className="mt-5" />
      </div>
    </div>
  );
}
