import AddQuestionForm from "@/app/dashboard/listening-tests/add/add-question-form";
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

export default function AddQuestionDialog() {
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const openDialog = () => setOpen(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm câu hỏi mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Câu Hỏi Mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddQuestionForm onSubmitSuccess={closeDialog} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
