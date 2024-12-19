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
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/store";
import {
  ArrowRight,
  ArrowRightFromLine,
  FileQuestion,
  Timer,
} from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

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
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <Card className="w-[300px] h-[400px] shadow-lg">
      <Image
        className="rounded-t-md"
        src={image}
        width={400}
        height={400}
        quality={100}
        alt="Carousel image 1"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="quicksand-semibold text-lg">
        <div className="flex h-5 items-center space-x-3 text-base">
          <div>Full</div>
          <Separator orientation="vertical" />
          <div>200 câu hỏi</div>
          <Separator orientation="vertical" />
          <div className="flex items-center">
            <Timer size={15} color="red" />
            120 phút
          </div>
        </div>
        <p className="text-base">{description}</p>
      </CardContent>
      <CardFooter className="flex flex-row-reverse">
        {isAuthenticated && user && (
          <Button onClick={onClick}>
            <ArrowRight />
            Vào thi
          </Button>
        )}
        {!isAuthenticated && !user && (
          <span className="text-sm">Đăng nhập để thi...</span>
        )}
      </CardFooter>
    </Card>
  );
}
