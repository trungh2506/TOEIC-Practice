"use client";
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

interface ToeicCardProps {
  title: string;
  type: string;
  description: string;
  image: string;
  onClick: () => void;
}

export default function ToeicCard({
  title,
  image,
  description,
  type,
  onClick,
}: ToeicCardProps) {
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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <CardContent className="quicksand-regular text-sm">
        <p className="text-base">{description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onClick}>Vào thi</Button>
      </CardFooter>
    </Card>
  );
}
