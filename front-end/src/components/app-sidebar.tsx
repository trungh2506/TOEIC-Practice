import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

// Menu items.
const items = [
  {
    title: "Trang chủ",
    url: "/",
    icon: Home,
    children: [],
  },
  {
    title: "Tài liệu miễn phí",
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
          <SidebarGroupLabel>TOEIC AREA LOGO</SidebarGroupLabel>
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
