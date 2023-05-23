import ScheduleList from "../organisms/ScheduleList";
import { DefaultContainer } from "../atoms/DefaultAtoms";
import { ScheduleType } from "@/services/firebase/firebase.type";

export default function Schedule() {
  const scheduleData: ScheduleType[] = [
    {
      id: "1",
      date: "2020.01.01",
      content: "테스트1"
    },
    {
      id: "2",
      date: "2021.02.02",
      content: "테스트2"
    }
  ];

  return (
    <DefaultContainer>
      <ScheduleList
        scheduleData={scheduleData}
      />
    </DefaultContainer>
  );
}
