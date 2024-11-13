import LoginForm from "@/components/login-form";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
