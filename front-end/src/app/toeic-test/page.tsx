import PracticeCard from "@/components/practice-card";
import { Separator } from "@/components/ui/separator";




export default function Page() {
  return (
    <div className="flex flex-col items-center sm:items-start gap-5">
      <div className="flex flex-col gap-5">
        <span className="text-4xl">Đề thi</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
        </div>
      </div>
    </div>
  );
}
