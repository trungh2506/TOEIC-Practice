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
  removeToeicTest,
} from "@/lib/redux/features/toeic-tests/toeicTestSlice";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ToeicTest = {
  _id: string;
  title: string;
  image: string;
  type: string;
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const toeicTest = row.original;
      const dispatch = useDispatch<AppDispatch>();
      const handleDelete = async () => {
        await dispatch(deleteToeicTest(toeicTest._id));
        dispatch(removeToeicTest(toeicTest._id));
        toast({
          description: <span>Xóa thành công!</span>,
        });
        // dispatch(getAllToeicTest(1));
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
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(toeicTest._id)}
            >
              Copy payment ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log(`Xem chi tiết ${toeicTest._id}`);
              }}
            >
              <Edit /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash /> Xóa đề thi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
