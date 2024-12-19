import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  cancelTest,
  clearAnswer,
  resumeTest,
  setAnswers,
  setQuestionNumberList,
  startTest,
} from "@/lib/redux/features/user-answer/userAnswerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function FullAudio({ source }: { source: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { onGoingTest } = useSelector((state: RootState) => state.userAnswer);
  const { toast } = useToast();
  // Đảm bảo audioRef có kiểu chính xác là HTMLAudioElement
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime); // Lấy currentTime và cập nhật state
    }
  };
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    } else {
      console.error("Audio element is not available.");
    }
  };

  const jumpToTime = (timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds; // Di chuyển đến thời gian mong muốn
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60); // Lấy số phút
    const seconds = Math.floor(timeInSeconds % 60); // Lấy số giây còn lại
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Đảm bảo giây có 2 chữ số
  };

  useEffect(() => {
    if (source && audioRef.current) {
      audioRef.current.src = source; // Gán source mới cho audio
      audioRef.current.play().catch((err) => console.error("Play error:", err));
    }
    console.log(source);
  }, [source]);

  useEffect(() => {
    if (onGoingTest && audioRef.current && onGoingTest.length > 0) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((err) => console.error("Play error:", err));
      }
      jumpToTime(onGoingTest[0]?.duration || 0);
    }
    console.log(source);
  }, [onGoingTest]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Lắng nghe sự kiện 'loadedmetadata' để lấy thời lượng khi file audio đã tải
      const handleLoadedMetadata = () => {
        setDuration(audio.duration); // Lấy thời lượng (duration) của audio
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      // Cleanup event listener
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      {audioRef.current &&
        onGoingTest[0]?.duration >= audioRef.current?.duration && (
          <p className="text-red-500">Đã hết phần thi Listening</p>
        )}
      <div>{formatTime(currentTime)} </div>
      <Progress value={(currentTime / duration) * 100} className="w-[60%]" />
      {formatTime(duration)}
      <audio
        onTimeUpdate={handleTimeUpdate}
        className="sm:w-[1000px] my-5"
        ref={audioRef}
        src={source}
      />
    </div>
  );
}
