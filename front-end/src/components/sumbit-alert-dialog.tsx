import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useSelector } from "react-redux";

export default function SubmitAlertDialog() {
  const { answers } = useSelector((state: RootState) => state.userAnswer);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Nộp bài</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {answers.length > 0 ? "Xác Nhận Nộp Bài?" : "Không Thể Nộp Bài"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {answers.length > 0
              ? "Bạn có chắc chắn muốn nộp bài không? Hành động này sẽ không thể hoàn tác."
              : "Bạn chưa làm bất kỳ câu hỏi nào. Vui lòng trả lời ít nhất một câu trước khi nộp bài."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {answers.length > 0 && <AlertDialogAction>Nộp bài</AlertDialogAction>}
          <AlertDialogCancel>Tiếp tục làm</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
