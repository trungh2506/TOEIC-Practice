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
    url: "grammar",
    icon: Leaf,
    children: [],
  },
  {
    title: "Luyện các kỹ năng",
    url: "#",
    icon: BookOpen,
    children: [
      {
        title: "Kỹ năng nghe",
        url: "#",
        // icon: Calendar,
      },
      {
        title: "Kỹ năng đọc",
        url: "#",
        // icon: BookOpenText,
      },
    ],
  },
  {
    title: "Bài kiểm tra",
    url: "toeic-test",
    icon: StickyNote,
    children: [],
  },
  {
    title: "Quản lý tài khoản",
    url: "#",
    icon: UserRound,
    children: [],
  },
  {
    title: "Cài đặt",
    url: "#",
    icon: Settings,
    children: [],
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon" className="text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>TOEIC AREA LOGO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  <SidebarMenuSub>
                    {item?.children?.length > 0 &&
                      item.children.map((children) => (
                        <SidebarMenuSubItem key={children.title}>
                          <SidebarMenuSubButton asChild />
                          <Link href={children.url}>
                            {/* <children.icon /> */}
                            <p>{children.title}</p>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
