"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { fetchUserProfile, logout } from "@/lib/redux/features/user/userSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  ChevronDown,
  MessageCircle,
  MessageCircleMore,
  Moon,
  ShoppingCart,
  Sun,
  SunMoon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export function NavBar() {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    // router.push("/");
  };

  const handleDarkMode = (checked: any) => {
    if (checked) setTheme("dark");
    else setTheme("light");
  };
  useEffect(() => {
    const getCookie = (name: any) => {
      const cookieMatch = document.cookie.match(
        "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
      );
      return cookieMatch ? cookieMatch.pop() : undefined;
    };

    const token = getCookie("jwt"); // Lấy token từ cookie

    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);
  return (
    <div className="flex flex-row gap-3 items-center">
      <Sun />
      <Switch
        id="dark-mode"
        defaultValue={"false"}
        onCheckedChange={handleDarkMode}
      />
      <Moon />
      {!isAuthenticated && (
        <Button asChild>
          <Link href="/auth">Đăng nhập</Link>
        </Button>
      )}
      {isAuthenticated && (
        <>
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" size="icon">
                <Bell size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]">
              <span className="text-sm text-gray-500">Chưa có thông báo!</span>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon">
            <MessageCircleMore size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:opacity-70">
              <Avatar className="cursor-pointer border border-b-2">
                <AvatarImage
                  src={
                    user?.avatar
                      ? user?.avatar
                      : "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href={"/profile"}>Thông tin cá nhân</a>
              </DropdownMenuItem>
              <DropdownMenuItem>Lịch sử luyện thi</DropdownMenuItem>
              <DropdownMenuItem>Thống kê</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 cursor-pointer"
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
