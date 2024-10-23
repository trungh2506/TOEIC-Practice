import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function PracticeCard() {
  return (
    <Card className="w-[300px]">
      <Image
        className="rounded-t-md"
        src="/carousel.jpg"
        width={400}
        height={300}
        quality={100}
        alt="Carousel image 1"
      />
      <CardHeader>
        <CardTitle>Part 1</CardTitle>
        <CardDescription>Photographs</CardDescription>
      </CardHeader>
      <CardContent className="quicksand-regular text-sm">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ullam
          blanditiis facere rerum distinctio dignissimos necessitatibus
          inventore consectetur. Omnis, voluptatibus soluta vel beatae
          perspiciatis ea. Velit possimus exercitationem ex. Esse.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Xem chi tiết</Button>
      </CardFooter>
    </Card>
  );
}
