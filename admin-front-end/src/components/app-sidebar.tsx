"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookA,
  BookOpen,
  Bot,
  CaseSensitive,
  Command,
  FilePlus,
  Files,
  FileText,
  Frame,
  GalleryVerticalEnd,
  HeadphoneOff,
  HeadphonesIcon,
  LayoutDashboard,
  LibraryBig,
  Map,
  PieChart,
  Plus,
  Settings,
  Settings2,
  SquareTerminal,
  UserRoundPlus,
  Users,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "Hàn Quốc Trung",
    email: "hantrung02@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Đề thi",
      url: "#",
      icon: Files,
      isActive: true,
      items: [
        {
          title: "Danh sách đề thi",
          url: "/dashboard/toeic-tests",
          icon: Files,
        },
        {
          title: "Thêm đề thi mới",
          url: "/dashboard/toeic-tests/add",
          icon: FilePlus,
        },
      ],
    },
    // {
    //   title: "Luyện nghe",
    //   url: "#",
    //   icon: Files,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Danh sách bài luyện nghe",
    //       url: "/dashboard/listening-tests",
    //       icon: HeadphonesIcon,
    //     },
    //     {
    //       title: "Thêm bài luyện nghe mới",
    //       url: "/dashboard/listening-tests/add",
    //       icon: FilePlus,
    //     },
    //   ],
    // },
    {
      title: "Thành viên",
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "Danh sách thành viên",
          url: "/dashboard/users",
          icon: UsersRound,
        },
      ],
    },
    // {
    //   title: "Ngữ pháp",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Danh sách bài học ngữ pháp",
    //       url: "#",
    //       icon: LibraryBig,
    //     },
    //     {
    //       title: "Thêm bài học ngữ pháp mới",
    //       url: "#",
    //       icon: Plus,
    //     },
    //   ],
    // },
    // {
    //   title: "Từ vựng",
    //   url: "#",
    //   icon: CaseSensitive,
    //   items: [
    //     {
    //       title: "Danh sách từ vựng",
    //       url: "#",
    //       icon: BookA,
    //     },
    //     {
    //       title: "Thêm từ vựng mới",
    //       url: "#",
    //       icon: Plus,
    //     },
    //   ],
    // },
  ],
  users: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center">
        <Image
          className="basis-1/3 rounded-md"
          src="/logo.png"
          width={200}
          height={100}
          quality={100}
          alt="Carousel image 1"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects users={data.users} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
