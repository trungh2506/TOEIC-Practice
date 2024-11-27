import React, { useState, useEffect } from "react";
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
  addBlankWord,
  replaceWithUnderLine,
} from "@/lib/redux/features/listening/listeningSlice";

export default function HighlightMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      const selection = window.getSelection();

      // Kiểm tra xem selection có phải là null không
      if (selection && selection.toString().trim()) {
        const text = selection.toString().trim();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        setMenuPosition({
          x: range.left + window.scrollX,
          y: range.top + window.scrollY + 20,
        });
        setSelectedText(text);
      } else {
        setSelectedText(null); // Ẩn menu nếu không có văn bản bôi đen
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="p-5">
      {selectedText && (
        <DropdownMenu open>
          <DropdownMenuTrigger asChild>
            {/* Invisible trigger to position dropdown */}
            <div
              className="absolute"
              style={{
                top: `${menuPosition.y}`,
                left: `${menuPosition.x}`,
                width: "0",
                height: "0",
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            forceMount
            className="absolute z-50 p-2  rounded shadow-md"
            style={{
              top: `${menuPosition.y}`,
              left: `${menuPosition.x}`,
            }}
          >
            <DropdownMenuLabel className="font-bold">
              {selectedText}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="">Xóa</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                dispatch(addBlankWord(selectedText));
                dispatch(replaceWithUnderLine(selectedText));
              }}
              className=""
            >
              Đóng dấu
            </DropdownMenuItem>
            <DropdownMenuItem className="">Dịch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
