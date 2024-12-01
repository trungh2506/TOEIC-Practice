"use client";

import { columns, ToeicTest } from "@/app/dashboard/toeic-tests/columns";
import { DataTable } from "./data-table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { getAllToeicTest } from "@/lib/redux/features/toeic-tests/toeicTestSlice";

export default function ToeicTestList() {
  const dispatch = useDispatch<AppDispatch>();
  const { toeicTestList, currentPage, loading } = useSelector(
    (state: RootState) => state.toeicTests
  );
  useEffect(() => {
    dispatch(getAllToeicTest(currentPage));
    console.log(toeicTestList);
  }, [currentPage, dispatch]);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={toeicTestList} />
    </div>
  );
}
