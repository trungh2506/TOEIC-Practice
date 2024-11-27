import AddQuestionForm from "@/app/dashboard/listening-tests/add/add-question-form";
import UpdateQuestionForm from "@/app/dashboard/listening-tests/add/update-question-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface UpdateQuestionDialogProps {
  index: number;
  question: any;
}

export default function UpdateQuestionDialog({
  index,
  question,
}: UpdateQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const openDialog = () => setOpen(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Chỉnh sửa câu hỏi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <UpdateQuestionForm
            onSubmitSuccess={closeDialog}
            index={index}
            question={question}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
