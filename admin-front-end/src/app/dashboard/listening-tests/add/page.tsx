"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichText from "@/components/richtext";
import { Textarea } from "@/components/ui/textarea";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { removeQuestion } from "@/lib/redux/features/listening/listeningSlice";
import AddQuestionDialog from "@/app/dashboard/listening-tests/add/add-question-dialog";
import UpdateQuestionDialog from "@/app/dashboard/listening-tests/add/update-question-dialog";
import HighlightMenu from "@/app/dashboard/listening-tests/add/hightlight-menu";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  original_conversation: z.string(),
  audio: z.string(),
  blank_words: z.array(z.string()),
  questions: z.array(z.string()),
});

export default function AddListeningTest() {
  const dispatch = useDispatch<AppDispatch>();
  const { questions, blank_words, modifyConversation } = useSelector(
    (state: RootState) => state.listeningTests
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { questions: [] },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Âm thanh</FormLabel>
              <FormControl>
                <Input placeholder="" type="file" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative w-[1000px]">
          <FormField
            control={form.control}
            name="original_conversation"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Đoạn hội thoại</FormLabel>
                <FormControl>
                  <RichText value={value} onChange={onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h1 className="text-xl">Đoạn hội thoại khi đóng dấu</h1>
          {parse(modifyConversation)}
        </div>

        <div>
          <h1 className="text-xl">Các từ đã đóng dấu</h1>
          {blank_words.map((word: any, index: number) => {
            return (
              <Badge key={index} variant="outline">
                {word}
              </Badge>
            );
          })}
        </div>

        <div>
          <div className="flex gap-2 items-center">
            <h1 className="text-xl">Câu hỏi</h1>
            <AddQuestionDialog />
          </div>
          {questions.length <= 0 && (
            <p className="italic text-sm p-2">Chưa có câu hỏi.</p>
          )}
          {questions.map((question: any, index: number) => {
            return (
              <div key={index} className="flex items-center gap-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-2xl">
                      {question?.question_number}. {question?.question_text}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 text-xl">
                      <span>A. {question?.option_a}</span>
                      <span>B. {question?.option_b}</span>
                      <span>C. {question?.option_c}</span>
                      <span>D. {question?.option_d}</span>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <UpdateQuestionDialog question={question} index={index} />
                <Button
                  className="quicksand-bold"
                  size={"sm"}
                  variant={"destructive"}
                  type="button"
                  onClick={() => dispatch(removeQuestion(index))}
                >
                  Xóa
                </Button>
              </div>
            );
          })}
        </div>
        <Button type="submit">Thêm</Button>
      </form>
    </Form>
  );
}
