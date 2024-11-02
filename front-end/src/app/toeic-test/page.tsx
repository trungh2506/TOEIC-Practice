"use client";
import PracticeCard from "@/components/toeic-card";
import { Separator } from "@/components/ui/separator";
import {
  getAllToeicTest,
  setCurrentPage,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toeicTestList, currentPage, loading } = useSelector(
    (state: RootState) => state.toeicTest
  );
  const handleSelectedToeicTest = (toeic_test_id: string) => {
    router.push(`/toeic-test/test/${toeic_test_id}`);
  };
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(getAllToeicTest(page));
  };

  useEffect(() => {
    dispatch(getAllToeicTest(currentPage));
  }, [dispatch, currentPage]);

  return (
    <div className="flex flex-col items-center sm:items-start gap-5">
      <div className="flex flex-col gap-5">
        <span className="text-4xl">Đề thi</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          {toeicTestList.map((toeicTest, index) => {
            return (
              <PracticeCard
                key={index}
                title={toeicTest?.title}
                type={toeicTest?.type}
                image={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${toeicTest.title}/images/${toeicTest?.image}`}
                description={`Mô tả cho ${toeicTest?.title}`}
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
