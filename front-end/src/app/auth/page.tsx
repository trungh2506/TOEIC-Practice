"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { login, register } from "@/lib/redux/features/user/userSlice";

import type { AppDispatch, RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const errorMessage = useSelector(
    (state: RootState) => state.user.message.message
  );
  const success = useSelector((state: RootState) => state.user.success);
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

  function onSubmitLoginForm(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    dispatch(login(values));
    if (success) router.push("/");
    // console.log(values);
  }

  function onSubmitRegisterForm(values: z.infer<typeof registerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    dispatch(register(values));
    if (success) router.push("/");
    console.log(values);
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
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
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
                  {errorMessage && (
                    <p className="text-red-500">{errorMessage}</p>
                  )}
                  <Button type="submit">Đăng nhập</Button>
                </form>
              </Form>
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
                  {/* {errorMessage && <p>{errorMessage}</p>} */}
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
