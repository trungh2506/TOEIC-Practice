import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <Button variant="outline" size="icon">
        <ShoppingCart size={20} />
      </Button>

      <Button variant="outline" size="icon">
        <Bell size={20} />
      </Button>

      <Button variant="outline" size="icon">
        <MessageCircleMore size={20} />
      </Button>

      <Button asChild>
        <Link href="login">Đăng nhập</Link>
      </Button>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
