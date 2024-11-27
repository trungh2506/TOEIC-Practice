"use client";
import RequireAuth from "@/components/require-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  fetchUserProfile,
  statisticsUser,
} from "@/lib/redux/features/user/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Root } from "postcss";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { z } from "zod";
import Image from "next/image";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import {
  getAllUserAnswer,
  setCurrentPage,
} from "@/lib/redux/features/user-answer/userAnswerSlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, allPart } = useSelector((state: RootState) => state.user);
  const { userAnswerList, currentPage, loading } = useSelector(
    (state: RootState) => state.userAnswer
  );

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(getAllUserAnswer(page));
  };

  useEffect(() => {
    console.log(allPart);
    dispatch(getAllUserAnswer(currentPage));
    dispatch(statisticsUser());
  }, [dispatch, currentPage]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row item-center sm:items-start sm:justify-around justify-center gap-5">
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <Avatar className="w-[150px] h-[150px]">
            <AvatarImage
              src={
                user?.avatar ? user?.avatar : "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 sm:items-start items-center">
            <span className="text-4xl ">{user?.username}</span>
            <span className="text-gray-500">{user?.email}</span>
            <span>{user?.fullname}</span>
            <div>
              {user?.roles === "user" ? (
                <Badge>Member</Badge>
              ) : (
                <Badge variant="destructive">Administrator</Badge>
              )}
            </div>
          </div>
        </div>
        {/* 
        <div className="flex flex-col sm:flex-row sm:gap-10 gap-5 items-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl text-black">Aim Score</span>
            <div className="bg-primary text-secondary p-8 rounded-full text-xl">
              600
            </div>
            <Button>Chỉnh sửa Aim Score</Button>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl text-black">Actual Score</span>
            <div className="bg-primary text-secondary p-8 rounded-full text-xl">
              550
            </div>
          </div>
        </div> */}
      </div>
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="flex">
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
          <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>
        {/* history */}
        <TabsContent value="history">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Tên đề thi</TableHead>
                <TableHead>Số câu đúng</TableHead>
                <TableHead>Số câu sai</TableHead>
                <TableHead>Số câu chưa làm</TableHead>
                <TableHead>Thời gian làm</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Part</TableHead>
                <TableHead>Chế độ thi</TableHead>
                <TableHead className="text-right">Ngày thi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userAnswerList && userAnswerList.length > 0 ? (
                userAnswerList.map((result: any, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium quicksand-bold">
                        {result?.toeic_test_id.title}
                      </TableCell>
                      <TableCell className="text-green-500">
                        {result?.correct_answers}
                      </TableCell>
                      <TableCell className="text-red-500">
                        {result?.incorrect_answers}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {result?.unanswered_answers}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {`${Math.floor(result?.duration / 60)
                          .toString()
                          .padStart(2, "0")}:${(result?.duration % 60)
                          .toString()
                          .padStart(2, "0")}`}
                      </TableCell>
                      <TableCell>{result?.total_score}</TableCell>
                      <TableCell>
                        {result?.part ? `${result?.part}` : "Full"}
                      </TableCell>
                      <TableCell>
                        {result?.isPractice ? (
                          <Badge variant={"outline"}>Luyện tập</Badge>
                        ) : (
                          <Badge>Thi thử</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {result?.date_answer
                          ? new Date(result.date_answer).toLocaleString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Không có dữ liệu"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell>Bạn chưa làm bài thi thử nào!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        {/* statistics */}
        <TabsContent value="statistics">
          <div className="flex flex-row flex-wrap w-[full] gap-5 justify-center items-center">
            {allPart &&
              allPart?.map((part: any, index: number) => {
                return (
                  <Card key={index} className="w-[400px]">
                    <Image
                      className="rounded-t-md"
                      src="/carousel.jpg"
                      width={400}
                      height={300}
                      quality={100}
                      alt={`Carousel image for part ${index + 1}`}
                    />
                    <CardHeader>
                      <CardTitle>
                        <div className="flex justify-between ">
                          <span>Part {index + 1}</span>
                          <div className="flex flex-row gap-5">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-green-500">Đúng</span>
                              <span>{part.corrects}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-red-500">Sai</span>
                              <span>{part.incorrects}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-gray-500">Chưa làm</span>
                              <span>{part.unanswers}</span>
                            </div>
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription>{part.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
        {/* settings  */}
        <TabsContent value="settings">Cài đặt.</TabsContent>
      </Tabs>
    </div>
  );
}
