import Schedule from "@/components/templates/Schedule";
import { queryScheduleDataFromServer } from "@/services/firebase/db.admin";
import { admin } from "@/services/firebase/firebase.admin";
import { getToday, getYearRange } from "@/services/util/util";
import { cookies } from "next/dist/client/components/headers";
import Home from "../page";

const SchedulePage = async () => {
  try {
    // firebase 서버 토큰 검증
    const token = await admin
      .auth()
      .verifyIdToken(cookies().get("token")?.value || "");
    if (token.uid !== "") {
      const selectedYear = getToday().substring(0, 4);
      const yearRange = getYearRange(selectedYear);

      // 서버로부터 데이터 가져오기
      const result = await queryScheduleDataFromServer(
        [
          {
            field: "date",
            operator: ">=",
            value: yearRange.fromYear,
          },
          {
            field: "date",
            operator: "<=",
            value: yearRange.toYear,
          },
        ],
        token.uid
      );

      return <Schedule scheduleDataFromServer={result} />;
    } else {
      return (
        // 인증 정보 없을 경우 기본 값
        <Schedule
          scheduleDataFromServer={{
            dataList: [],
            lastVisible: null,
            componentsText: {
              scheduleAddForm: {
                button: "Add",
                placeholder: "Enter your schedule.",
                title: "Enter schedule",
              },
              scheduleEditForm: {
                deleteButton: "Delete",
                editButton: "Edit",
                resetButton: "Reset",
              },
            },
          }}
        />
      );
    }
  } catch (error: any) {
    if (error.code === "auth/id-token-expired") {
      // 토큰 만료 시 루트 페이지로 이동
      return <Home />;
    } else {
      console.log(error.message);
    }
  }
};

export default SchedulePage;
