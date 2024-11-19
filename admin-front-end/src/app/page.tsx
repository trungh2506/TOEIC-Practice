"use client";
import LoginForm from "@/components/login-form";
import { RootState } from "@/lib/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, []);
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
