"use client";

import { ScheduleType } from "@/services/firebase/firebase.type";
import { DefaultButton, DefaultCol, DefaultRow } from "../atoms/DefaultAtoms";
import { checkLogin, logOut } from "@/services/firebase/auth";
import { useRouter } from "next/navigation";
import { ScheduleRow } from "../atoms/CustomAtoms";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { queryScheduleData } from "@/services/firebase/db";
import { getToday, getYearRange } from "@/services/util/util";

interface ScheduleProps {
  scheduleData: ScheduleType[];
  lastVisible: string;
}

export default function Schedule({
  scheduleData,
  lastVisible
}: ScheduleProps) {
  const router = useRouter();

  const scheduleList = scheduleData.map((value) =>
    <ScheduleRow key={value?.id}>
      <DefaultCol>
        {value?.content}
      </DefaultCol>
    </ScheduleRow>
  );

  const nextLastVisible: QueryDocumentSnapshot<DocumentData> = JSON.parse(lastVisible);

  checkLogin().then((user) => {
    const selectedYear = getToday().substring(0,4);
    const yearRange = getYearRange(selectedYear);

    queryScheduleData([
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
    ], user?.uid||"", nextLastVisible).then((data) => {
      console.log(data.dataList);
    });
  });

  return (
    <>
      <DefaultRow>
        <DefaultCol>
          <DefaultButton onClick={async () => {
            await logOut();
            router.push("/signin");
          }}>Sign Out</DefaultButton>
        </DefaultCol>
      </DefaultRow>
      {scheduleList}
    </>
  );
}