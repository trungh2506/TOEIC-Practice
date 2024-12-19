"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { login } from "@/lib/redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" })
    .regex(/[a-zA-Z0-9]/, { message: "Mật khẩu phải có chữ và số" }),
});

export default function LoginForm() {
  const router = useRouter();
  const { loading, message } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // thực hiện đăng nhập
      const result = await dispatch(login(values));

      if (result.meta.requestStatus === "rejected") {
        toast({
          variant: "destructive",
          description: result.payload as string,
        });
      }
      // Kiểm tra kết quả từ đăng nhập
      if (result.meta.requestStatus === "fulfilled") {
        router.push("/dashboard");
        toast({
          description: "Đăng nhập thành công!",
        });
      }
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để đăng nhập vào tài khoản
            <strong className="text-lg"> Quản trị viên</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              method="post"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="admin@admin.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="quicksand-bold w-full">
                  {!loading ? (
                    "Đăng nhập"
                  ) : (
                    <Loader2 className="animate-spin" />
                  )}
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </form>
          </Form>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
