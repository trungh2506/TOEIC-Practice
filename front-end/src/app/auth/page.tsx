"use client";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, CalendarIcon } from "lucide-react";
import {
  login,
  register,
  signInWithGoogle,
} from "@/lib/redux/features/user/userSlice";

import type { AppDispatch, RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerFormSchema = z
  .object({
    username: z.string().min(6),
    email: z.string().email(),
    fullname: z.string(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
    number_phone: z.string().min(10),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const success = useSelector((state: RootState) => state.user.success);
  const message = useSelector((state: RootState) => state.user.message);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const { toast } = useToast();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      fullname: "",
      password: "",
      confirm_password: "",
      number_phone: "",
    },
  });

  async function onSubmitLoginForm(values: z.infer<typeof loginFormSchema>) {
    // Thực hiện đăng nhập
    const result = await dispatch(login(values));

    // Kiểm tra kết quả từ đăng nhập
    if (result.meta.requestStatus === "fulfilled") {
      // Nếu đăng nhập thành công, điều hướng ngay lập tức
      toast({
        title: "Đăng nhập thành công",
      });
      router.push("/");
    } else {
      // Hiển thị thông báo lỗi
      toast({
        variant: "destructive",
        title: "Lỗi đăng nhập",
        description: message,
      });
    }
  }

  async function onSubmitRegisterForm(
    values: z.infer<typeof registerFormSchema>
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await dispatch(register(values));
    if (success) router.push("/");
    console.log(values);
  }

  function signInGoogle() {
    window.location.href = "http://localhost:3001/auth/google";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Tabs
        defaultValue="signin"
        className="w-full sm:w-[500px]  quicksand-semibold "
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
          <TabsTrigger value="signup">Đăng ký</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl">Đăng Nhập</CardTitle>
              <CardDescription>
                Trở thành thành viên của Toeic Area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onSubmitLoginForm)}
                  className="space-y-8"
                >
                  {/* Email Field */}
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex items-center justify-center">
                    <Button type="submit" disabled={loading}>
                      Đăng nhập
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="flex flex-col gap-3 items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                  <Separator className="w-[100px]" />
                  <span className="text-gray-400">hoặc</span>
                  <Separator className="w-[100px]" />
                </div>
                <Button variant="outline" onClick={() => signInGoogle()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl">Đăng Ký</CardTitle>
              <CardDescription>
                Trở thành thành viên của Toeic Area sẽ có quyền lợi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onSubmitRegisterForm)}
                  className="space-y-8"
                >
                  {/* Container chia thành 2 cột */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="fullname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="number_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Xác nhận mật khẩu</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Đăng ký</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
