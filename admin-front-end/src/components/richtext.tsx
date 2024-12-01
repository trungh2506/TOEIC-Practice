import HighlightMenu from "@/app/dashboard/listening-tests/add/hightlight-menu";
import { setModifyConversation } from "@/lib/redux/features/listening/listeningSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho ReactQuill
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
const ReactQuillNoSSR = dynamic(() => import("react-quill"), {
  ssr: false, // Tắt SSR
});

export default function RichText({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(setModifyConversation(""));
  }, []);
  useEffect(() => {
    console.log(value);
    if (value) {
      dispatch(setModifyConversation(value));
    }
  }, [value, dispatch]);

  return (
    <div className="">
      <ReactQuillNoSSR theme="snow" value={value} onChange={onChange} />
      <HighlightMenu />
    </div>
  );
}
