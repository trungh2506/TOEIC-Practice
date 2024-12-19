import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  BookOpenText,
  Calendar,
  Home,
  Inbox,
  Leaf,
  Search,
  Settings,
  StickyNote,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Trang chủ",
    url: "/",
    icon: Home,
    children: [],
  },
  {
    title: "Tài liệu ngữ pháp",
    url: "/grammar",
    icon: Leaf,
    children: [],
  },
  {
    title: "Luyện các kỹ năng",
    url: "/practice",
    icon: BookOpen,
    children: [],
  },
  {
    title: "Đề thi",
    url: "/toeic-test",
    icon: StickyNote,
    children: [],
  },
  // {
  //   title: "Quản lý tài khoản",
  //   url: "/profile",
  //   icon: UserRound,
  //   children: [],
  // },
  {
    title: "Cài đặt",
    url: "#",
    icon: Settings,
    children: [],
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <Image
              className="basis-1/3 rounded-md"
              src="/logo.png"
              width={300}
              height={200}
              quality={100}
              alt="Carousel image 1"
            />
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
