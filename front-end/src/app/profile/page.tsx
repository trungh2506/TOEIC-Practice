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
import { fetchUserProfile } from "@/lib/redux/features/user/userSlice";
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

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  // useEffect(() => {
  //   dispatch(fetchUserProfile());
  //   console.log(user);
  // }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row item-center sm:items-start sm:justify-around justify-center gap-5">
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <Avatar className="w-[150px] h-[150px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 sm:items-start items-center">
            <span className="text-4xl text-black">{user?.username}</span>
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

        {/* <div className="flex flex-col sm:flex-row sm:gap-10 gap-5 items-center">
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
                <TableHead className="text-right">Ngày thi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">TEST 1</TableCell>
                <TableCell className="text-green-500">150</TableCell>
                <TableCell className="text-red-500">50</TableCell>
                <TableCell className="text-gray-500">0</TableCell>
                <TableCell>100 phút</TableCell>
                <TableCell className="text-right">25/06/2002</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TEST 1</TableCell>
                <TableCell className="text-green-500">150</TableCell>
                <TableCell className="text-red-500">50</TableCell>
                <TableCell className="text-gray-500">0</TableCell>
                <TableCell>100 phút</TableCell>
                <TableCell className="text-right">25/06/2002</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TEST 1</TableCell>
                <TableCell className="text-green-500">150</TableCell>
                <TableCell className="text-red-500">50</TableCell>
                <TableCell className="text-gray-500">0</TableCell>
                <TableCell>100 phút</TableCell>
                <TableCell className="text-right">25/06/2002</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        {/* statistics */}
        <TabsContent value="statistics">
          <div className="flex flex-row flex-wrap w-[full] gap-5 justify-center items-center">
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 1</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Mô tả hình ảnh</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 2</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Hỏi Và Trả Lời</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 3</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Đoạn Hội Thoại</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 4</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Bài Nói Chuyện</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 5</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Hoàn thành câu</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 6</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Hoàn Thành Đoạn Văn</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-[400px]">
              <Image
                className="rounded-t-md"
                src="/carousel.jpg"
                width={400}
                height={300}
                quality={100}
                alt="Carousel image 1"
              />
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between ">
                    <span>Part 7</span>
                    <div className="flex flex-row gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-500">Đúng</span>
                        <span>150</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-500">Sai</span>
                        <span>50</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-gray-500"> Chưa làm</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Đọc Hiểu</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
        {/* settings  */}
        <TabsContent value="settings">Cài đặt.</TabsContent>
      </Tabs>
    </div>
  );
}
