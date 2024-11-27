"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  addQuestion,
  updateQuestion,
} from "@/lib/redux/features/listening/listeningSlice";

const formSchema = z.object({
  question_number: z.string().transform((val) => Number(val)),
  question_text: z.string(),
  part: z.string(),
  section: z.string(),
  option_a: z.string().optional(),
  option_c: z.string().optional(),
  option_b: z.string().optional(),
  option_d: z.string().optional(),
  correct_answer: z.string().optional(),
  script: z.string().optional(),
});

export default function UpdateQuestionForm({
  onSubmitSuccess,
  index,
  question,
}: {
  onSubmitSuccess: () => void;
  index: number;
  question: any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: question
      ? {
          question_number: question.question_number.toString(),
          question_text: question.question_text,
          part: question.part,
          section: question.section,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          correct_answer: question.correct_answer,
          script: question.script,
        }
      : {},
  });
  const dispatch = useDispatch<AppDispatch>();
  const { questions } = useSelector((state: RootState) => state.listeningTests);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      console.log("cập nhật", index, updateQuestion);
      dispatch(updateQuestion({ updatedQuestion: values, index: index }));
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
      onSubmitSuccess();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }
  useEffect(() => {
    // console.log(questions);
  }, [dispatch, questions]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="question_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câu hỏi số</FormLabel>
              <FormControl>
                <Input
                  defaultValue={question?.question_number}
                  placeholder=""
                  type="string"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="question_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câu hỏi</FormLabel>
              <FormControl>
                <Input
                  defaultValue={question?.question_text}
                  placeholder=""
                  type="text"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={question?.part}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={question?.part}
                          placeholder=""
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần bài</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={question?.section}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="listening">Nghe</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="option_a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đáp án A</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={question?.option_a}
                      placeholder=""
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="option_b"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đáp án B</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={question?.option_b}
                      placeholder=""
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="option_c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đáp án C</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={question?.option_c}
                      placeholder=""
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="option_d"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đáp án D</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={question?.option_d}
                      placeholder=""
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="correct_answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu trả lời đúng</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={question?.correct_answer}
                      placeholder=""
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giải thích</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={question?.script}
                      placeholder=""
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button className="quicksand-bold" type="submit">
          Chỉnh sửa
        </Button>
      </form>
    </Form>
  );
}
