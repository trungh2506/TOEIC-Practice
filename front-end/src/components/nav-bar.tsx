import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageCircle,
  MessageCircleMore,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

export function NavBar() {
  return (
    <div className="flex flex-row gap-3 items-center">
      <ShoppingCart size={20} />
      <Bell size={20} />
      <MessageCircleMore size={20} />

      <Button asChild>
        <Link href="login">Đăng nhập</Link>
      </Button>
    </div>
  );
}
