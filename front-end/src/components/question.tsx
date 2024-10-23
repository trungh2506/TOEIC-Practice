import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Question() {
  return (
    <div className="flex flex-row gap-5 mb-5">
      <div className="mt-3">
        <Button
          size={"icon"}
          className="text-white text-sm p-1 rounded-full bg-primary"
        >
          200
        </Button>
      </div>
      <div>
        <Image
          className="rounded-md mb-3"
          src="/1.png"
          width={550}
          height={300}
          quality={100}
          alt="Carousel image 1"
        />
        <span>How did this _____ broken ?</span>
        <RadioGroup className="mt-3 ml-3 flex flex-col ">
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-a" id="option-a" />
            <Label htmlFor="option-a">A</Label>
          </div>
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-b" id="option-b" />
            <Label htmlFor="option-b">B</Label>
          </div>
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-c" id="option-c" />
            <Label htmlFor="option-c">C</Label>
          </div>
          <div className="flex items-center space-x-2 hover:text-primary">
            <RadioGroupItem value="option-d" id="option-d" />
            <Label htmlFor="option-d">D</Label>
          </div>
        </RadioGroup>
        <Separator className="mt-5" />
      </div>
    </div>
  );
}
