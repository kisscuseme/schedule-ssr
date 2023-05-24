import Schedule from "@/components/templates/Schedule";
import { queryScheduleDataFromServer } from "@/services/firebase/db.admin";
import { admin } from "@/services/firebase/firebase.admin";
import { getToday, getYearRange } from "@/services/util/util";
import { cookies } from "next/dist/client/components/headers";

const SchedulePage = async () => {
  const token = await admin.auth().verifyIdToken(cookies().get("token")?.value||"");
  
  const selectedYear = getToday().substring(0,4);
  const yearRange = getYearRange(selectedYear);

  const result = await queryScheduleDataFromServer([
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
  ], token.uid);
  const scheduleData = result.dataList;
  const lastVisible = result.lastVisible;
  const lastVisibleStr = JSON.stringify(lastVisible);

  return (
    <Schedule
      scheduleData={scheduleData}
      lastVisible={lastVisibleStr}
    />
  );
}

export default SchedulePage;