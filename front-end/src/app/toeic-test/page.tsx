"use client";
import ToeicCard from "@/components/toeic-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast, useToast } from "@/hooks/use-toast";
import {
  getAllToeicTest,
  setCurrentPage,
  setIsExaming,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";
import {
  cancelTest,
  clearAnswer,
  resumeTest,
  setAnswers,
  setQuestionNumberList,
  startTest,
} from "@/lib/redux/features/user-answer/userAnswerSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Files } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { toeicTestList, currentPage, loading } = useSelector(
    (state: RootState) => state.toeicTest
  );
  const { message } = useSelector((state: RootState) => state.userAnswer);
  const handleSelectedToeicTest = async (toeic_test_id: string) => {
    dispatch(clearAnswer());
    const result = await dispatch(startTest(toeic_test_id));
    if (result.meta.requestStatus === "rejected") {
      toast({
        title: "Lỗi",
        description: result.payload.message || "Đã xảy ra lỗi",
        variant: "destructive",
        action: (
          <div className="flex flex-col gap-1">
            <ToastAction
              altText="Vào lại"
              className="quicksand-bold"
              onClick={() => {
                console.log(result.payload.onGoingTest[0].answers);
                dispatch(setAnswers(result.payload.onGoingTest[0].answers));
                dispatch(
                  resumeTest(result.payload.onGoingTest[0].toeic_test_id)
                );
                router.push(
                  `/toeic-test/test/${result.payload.onGoingTest[0]?.toeic_test_id}`
                );
                dispatch(setIsExaming(true));
              }}
            >
              Vào lại
            </ToastAction>
            <ToastAction
              altText="Hủy bài thi trước"
              onClick={() => {
                if (result.payload.onGoingTest[0]?._id) {
                  const isSuccess = dispatch(
                    cancelTest(result.payload.onGoingTest[0]._id)
                  );
                  alert("Hủy thành công!");
                } else {
                  console.error("Không tìm thấy ID bài thi!");
                }
              }}
              className="quicksand-bold"
            >
              Hủy bài thi trước
            </ToastAction>
          </div>
        ),
      });
    } else if (result.meta.requestStatus === "fulfilled") {
      dispatch(setIsExaming(true));
      router.push(`/toeic-test/test/${toeic_test_id}`);
    }
    const handlePageChange = (page: number) => {
      dispatch(setCurrentPage(page));
      dispatch(getAllToeicTest(page));
    };
  };
  useEffect(() => {
    dispatch(getAllToeicTest(currentPage));
  }, [dispatch, currentPage]);

  return (
    <div className="flex flex-col justify-center items-center sm:items-start gap-5">
      <>
        <div className=" sm:block bottom-20 bg-primary rounded-md p-5 text-primary-foreground">
          <span className="text-4xl">Khu vực luyện đề</span>
          <p className="quicksand-regular">
            Trong quá trình chuẩn bị cho kỳ thi TOEIC, việc luyện tập với các bộ
            đề thực tế là một phương pháp hiệu quả giúp bạn làm quen với cấu
            trúc bài thi và cải thiện kỹ năng nghe và đọc. Các bộ đề TOEIC 2 kỹ
            năng, bao gồm phần Nghe và phần Đọc, được thiết kế để giúp bạn tăng
            cường khả năng hiểu và xử lý thông tin trong môi trường giao tiếp
            tiếng Anh thực tế.
          </p>
        </div>
      </>
      <div className="flex flex-col gap-5">
        <span className="text-4xl">Đề Thi</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          {loading &&
            Array(5)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-[300px] h-[500px] rounded-md"
                />
              ))}
          {!loading &&
            toeicTestList.map((toeicTest: any, index: number) => {
              return (
                <ToeicCard
                  key={index}
                  title={toeicTest?.title}
                  type={""}
                  image={`${toeicTest?.image}&raw=1`}
                  description={``}
                  onClick={() => {
                    handleSelectedToeicTest(toeicTest._id);
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
