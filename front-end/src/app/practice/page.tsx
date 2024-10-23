import PracticeCard from "@/components/practice-card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col items-center sm:items-start gap-10">
      <div className="flex flex-col gap-5">
        <span className="text-4xl">Listening</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <span className="text-4xl">Reading</span>
        <Separator />
        <div className="flex flex-col sm:flex-row gap-5">
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
          <PracticeCard></PracticeCard>
        </div>
      </div>
    </div>
  );
}
