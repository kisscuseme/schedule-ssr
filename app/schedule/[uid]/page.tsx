import Schedule from "@/components/templates/Schedule";
import { queryScheduleData } from "@/services/firebase/db";
import { firebaseAuth } from "@/services/firebase/firebase";
import { firebaseAdminApp } from "@/services/firebase/firebase.admin";
import { ScheduleType } from "@/services/firebase/firebase.type";
import { getToday, getYearRange } from "@/services/util/util";
import { getAuth } from "firebase/auth";

const SchedulePage = async ({
  params
}: {
  params: {uid: string;
}}) => {
  const selectedYear = getToday().substring(0,4);

  const getScheduleData = () => {
    const yearRange = getYearRange(selectedYear);
    return queryScheduleData([
      {
        field: "date",
        operator: ">=",
        value: yearRange.fromYear
      },
      {
        field: "date",
        operator: "<=",
        value: yearRange.toYear
      }
    ], params.uid, null);
  }

  const result: ScheduleType[] = []; // await getScheduleData();

  return <Schedule scheduleData={result} />;
}

export default SchedulePage;