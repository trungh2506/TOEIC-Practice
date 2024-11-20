import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  resetTimer,
  stopTimer,
} from "@/lib/redux/features/toeic-test/toeicTestSlice";
import {
  clearAnswer,
  submitAnswer,
  submitTest,
} from "@/lib/redux/features/user-answer/userAnswerSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const DURATION_TEST = 120 * 60;

export default function SubmitAlertDialog() {
  const router = useRouter();
  const { answers, currentUserAnswer, markedQuestions } = useSelector(
    (state: RootState) => state.userAnswer
  );
  const { timer } = useSelector((state: RootState) => state.toeicTest);
  const param = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmitButton = () => {
    dispatch(stopTimer());
    const duration: number = DURATION_TEST - timer;
    const toeic_test_id = param?.toeic_test_id;
    router.push(`/toeic-test/test/${toeic_test_id}/result`);
    console.log("Submitted", {
      toeic_test_id: toeic_test_id,
      answers: answers,
      duration: duration,
    });
    // dispatch(
    //   submitAnswer({
    //     toeic_test_id: toeic_test_id,
    //     answers: answers,
    //     duration: duration,
    //   })
    // );

    dispatch(
      submitTest({
        toeic_test_id: toeic_test_id,
        answers: answers,
      })
    );
    dispatch(resetTimer(DURATION_TEST));
    dispatch(clearAnswer());
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Nộp bài</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {answers.length > 0 ? "Xác Nhận Nộp Bài?" : "Không Thể Nộp Bài"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {markedQuestions.length > 0 &&
              "Bạn có câu hỏi đang đánh dấu, bạn có chắc muốn nộp bài không?"}
            <br />
            {answers.length > 0
              ? "Bạn có chắc chắn muốn nộp bài không? Hành động này sẽ không thể hoàn tác."
              : "Bạn chưa làm bất kỳ câu hỏi nào. Vui lòng trả lời ít nhất một câu trước khi nộp bài."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {answers.length > 0 && (
            <AlertDialogAction onClick={handleSubmitButton}>
              Nộp bài
            </AlertDialogAction>
          )}
          <AlertDialogCancel>Tiếp tục làm</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
