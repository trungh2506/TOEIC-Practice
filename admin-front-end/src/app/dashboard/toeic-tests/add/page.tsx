"use client";
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  resetStatus,
  uploadToeicTest,
} from "@/lib/redux/features/toeic-tests/toeicTestSlice";
import { toast, useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { socket } from "../../../../socket";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string(),
  testImage: z.any(),
  type: z.enum(["full", "reading", "listening"]),
  questions: z.any(),
  passages: z.any(),
  fullAudio: z.any(),
  audios: z.any(),
  images: z.any(),
});

export default function AddToeicTest() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [transport, setTransport] = useState("N/A");

  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { toeicTestList, currentPage, loading, success, error } = useSelector(
    (state: RootState) => state.toeicTests
  );
  const [uploadedFiles, setUploadedFiles] = useState({
    testImage: null,
    questions: null,
    passages: null,
    fullAudio: null,
    audios: [],
    images: [],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // console.log(values);
      const formData = new FormData();

      if (values?.title) {
        formData.append("title", String(values.title));
      }
      if (values?.type) {
        formData.append("type", String(values.type));
      }

      Object.entries(uploadedFiles).forEach(([key, files]) => {
        if (Array.isArray(files)) {
          files.forEach((file) => formData.append(key, file));
        } else if (files) {
          formData.append(key, files);
        }
      });
      console.log("----------------------");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      socket.off("uploading");
      socket.on("uploading", (data: any) => {
        toast({
          description: <span>{data.message}</span>,
        });
      });

      await dispatch(uploadToeicTest(formData));

      if (success) {
        toast({
          description: (
            <span>
              Thêm mới đề thi
              <i className="font-semibold"> {form.getValues("title")}</i> thành
              công!
            </span>
          ),
        });
      }

      if (error) {
        toast({
          description: <span>Đã xảy ra lỗi khi thêm mới đề thi.</span>,
        });
      }
      dispatch(resetStatus());
    } catch (error) {
      console.error("Form submission error", error);
      // toast.error("Failed to submit the form. Please try again.");
    }
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: event.target.multiple ? Array.from(files) : files[0],
      }));
    }
    // console.log(files);
  };

  //SOCKET
  useEffect(() => {
    if (isConnected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đề thi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="text"
                        {...field}
                        // onChange={(e) => handleFileChange(e, "title")}
                      />
                    </FormControl>
                    <FormDescription>Tiêu đề cho đề thi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="testImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh đề thi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="file"
                        {...field}
                        onChange={(e) => handleFileChange(e, "testImage")}
                      />
                    </FormControl>
                    <FormDescription>Ảnh hiển thị cho đề thi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại đề thi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="listening">Listening</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Loại đề thi</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                disabled={loading}
                control={form.control}
                name="questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Câu Hỏi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="file"
                        {...field}
                        onChange={(e) => handleFileChange(e, "questions")}
                      />
                    </FormControl>
                    <FormDescription>
                      Từng câu hỏi trong đề thi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                disabled={loading}
                control={form.control}
                name="passages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Đoạn Văn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="file"
                        {...field}
                        onChange={(e) => handleFileChange(e, "passages")}
                      />
                    </FormControl>
                    <FormDescription>
                      Từng đoạn văn trong đề thi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="fullAudio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Audio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="file"
                        {...field}
                        onChange={(e) => handleFileChange(e, "fullAudio")}
                      />
                    </FormControl>
                    <FormDescription>
                      File âm thanh full cho phần thi Listening.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="audios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio Từng Phần</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="file"
                        {...field}
                        multiple
                        onChange={(e) => handleFileChange(e, "audios")}
                      />
                    </FormControl>
                    <FormDescription>
                      File âm thanh cho từng câu hỏi phần Listening.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-4">
              <FormField
                disabled={loading}
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình Ảnh</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="file"
                        {...field}
                        multiple
                        onChange={(e) => handleFileChange(e, "images")}
                      />
                    </FormControl>
                    <FormDescription>
                      Hình ảnh cho từng câu hỏi.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            disabled={loading}
            size={"lg"}
            type="submit"
            className="quicksand-bold"
          >
            {loading && <Loader2 className="animate-spin" />}
            Thêm
          </Button>
        </form>
      </Form>

      {/* <div>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div> */}
    </>
  );
}
