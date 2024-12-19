"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Info, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { deleteUser, refreshUser, restoreUser } from "@/lib/redux/features/user/userSlice";
import { toast } from "@/hooks/use-toast";

export type Users = {
  _id: string;
  username: string;
  avatar: string;
  fullname: string;
  email: string;
  roles: "admin" | "user";
  meta_data: {
    is_deleted: boolean;
  };
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên người dùng
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Họ và tên
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "avatar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ảnh đại diện
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      return cell.getValue() ? (
        <Image
          src={String(cell.getValue())}
          alt="Avatar"
          width={50}
          height={50}
          quality={100}
        />
      ) : (
        <Badge variant={"outline"}>none</Badge>
      );
    },
  },
  {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vai trò
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const isAdmin = cell.getValue() === "admin" ? true : false;
      return isAdmin ? (
        <Badge variant="destructive">Administrator</Badge>
      ) : (
        <Badge>Member</Badge>
      );
    },
  },
  {
    accessorKey: "meta_data",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Đã xóa mềm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const metaData = row.original.meta_data; // Lấy meta_data từ row
      const isDeleted = metaData?.is_deleted; // Lấy trường is_deleted từ meta_data
      return (
        <span>
          {isDeleted ? (
            <span className="text-red-500">Đã xóa</span> // Hiển thị nếu đã xóa
          ) : (
            <span className="text-green-500">Chưa xóa</span> // Hiển thị nếu chưa xóa
          )}
        </span>
      );
    },
    accessorFn: (row) => row.meta_data.is_deleted,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const router = useRouter();
      const dispatch = useDispatch<AppDispatch>();
      const handleDelete = async () => {
        const result = await dispatch(deleteUser(user._id));
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(refreshUser({ id: user._id, is_deleted: true }));
          toast({
            description: <span>Xóa mềm thành công!</span>,
          });
        } else
          toast({
            description: <span>Xảy ra lỗi khi xóa!</span>,
          });
      };
      const handleRestore = async () => {
        const result = await dispatch(
          restoreUser({ user_id: user._id.toString() })
        );
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(
            refreshUser({
              id: user._id,
              is_deleted: false,
            })
          );
          toast({
            description: <span>Khôi phục thành công!</span>,
          });
        }
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Info /> Xem chi tiết
            </DropdownMenuItem>
            {row.original.meta_data.is_deleted ? (
              <DropdownMenuItem onClick={handleRestore}>
                <Trash /> Khôi phục
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={handleDelete}>
                <Trash /> Xóa mềm
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
