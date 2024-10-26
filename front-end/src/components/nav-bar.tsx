"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/redux/features/user/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import {
  Bell,
  MessageCircle,
  MessageCircleMore,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export function NavBar() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
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

      {!isAuthenticated ? (
        <Button asChild>
          <Link href="/auth">Đăng nhập</Link>
        </Button>
      ) : (
        <Button onClick={handleLogout}>Đăng xuất</Button>
      )}
      {isAuthenticated && (
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
