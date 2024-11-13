"use client";

import { columns, Users } from "@/app/dashboard/users/columns";
import { DataTable } from "@/app/dashboard/users/data-table";
import { getAllUser } from "@/lib/redux/features/user/userSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// async function getData(): Promise<Users[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       _id: "728ed52f",
//       avatar: "728ed52f",
//       username: "trunghan",
//       fullname: "Hàn Quốc Trung",
//       email: "hantrung02@gmail.com",
//       roles: "admin",
//     },
//     // ...
//   ];
// }

export default function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const { userList, currentPage } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    dispatch(getAllUser(currentPage));
  }, []);
  // const data = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={userList} />
    </div>
  );
}
