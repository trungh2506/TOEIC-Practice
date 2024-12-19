"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Info, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import {
  deleteToeicTest,
  getAllToeicTest,
  refreshToeicTest,
  restoreToeicTest,
} from "@/lib/redux/features/toeic-tests/toeicTestSlice";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type ToeicTest = {
  _id: string;
  title: string;
  image: string;
  type: string;
  meta_data: {
    is_deleted: boolean;
  };
};

export const columns: ColumnDef<ToeicTest>[] = [
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
    accessorFn: (row) => row._id,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tiêu đề
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.title,
  },
  {
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hình ảnh
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => (
      <Image
        src={String(cell.getValue()) + "&raw=1"}
        alt="Image"
        width={200}
        height={200}
        quality={100}
      />
    ),
    accessorFn: (row) => row.image,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loại
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.type,
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
      const toeicTest = row.original;
      const router = useRouter();
      const dispatch = useDispatch<AppDispatch>();
      const handleDelete = async () => {
        const result = await dispatch(deleteToeicTest(toeicTest._id));
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(refreshToeicTest({ id: toeicTest._id, is_deleted: true }));
          toast({
            description: <span>Xóa mềm thành công!</span>,
          });
        } else
          toast({
            description: <span>Xảy ra lỗi khi xóa!</span>,
          });
      };
      const handleUpdate = async () => {
        router.push(`toeic-tests/update/${toeicTest._id.toString()}`);
      };
      const handleRestore = async () => {
        const result = await dispatch(
          restoreToeicTest({ toeic_test_id: toeicTest._id.toString() })
        );
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(
            refreshToeicTest({
              id: toeicTest._id,
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
            <DropdownMenuItem onClick={handleUpdate}>
              <Edit /> Chỉnh sửa
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
