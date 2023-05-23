import ScheduleList from "../organisms/ScheduleList";
import { DefaultContainer } from "../atoms/DefaultAtoms";
import { ScheduleType } from "@/services/firebase/firebase.type";

export default function Schedule({
  scheduleData
}: {
  scheduleData: ScheduleType[]
}) {
  return (
    <DefaultContainer>
      <ScheduleList
        scheduleData={scheduleData}
      />
    </DefaultContainer>
  );
}
