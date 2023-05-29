import { decrypt, getDay, getReformDate, l } from "../util/util";
import { admin } from "./firebase.admin";
import { getFullPath, limitNumber } from "./db";
import {
  ComponentsTextType,
  ScheduleType,
  WhereConfigType,
} from "@/types/types";

// 서버에서 firestore의 where 조건문을 만들기 위한 함수
const makeRangeQueryFromServer = (
  ref: admin.firestore.Query<admin.firestore.DocumentData>,
  condition: WhereConfigType
) => {
  return ref.where(condition.field, condition.operator, condition.value);
};

// 서버에서 firestore의 where 조건문을 2가지 이상 만들기 위한 함수
const makeRangeQueriesFromServer = (
  ref: admin.firestore.Query<admin.firestore.DocumentData>,
  whereConfig: WhereConfigType[]
) => {
  let whereRef = ref;
  for (const condition of whereConfig) {
    whereRef = makeRangeQueryFromServer(whereRef, condition);
  }
  return whereRef;
};

// 서버에서 firestore의 schedule 데이터를 조회
const queryScheduleDataFromServer = async (
  whereConfig: WhereConfigType[],
  uid: string
) => {
  const fullPath = getFullPath(uid);
  const collectionRef = admin.firestore().collection(fullPath);
  const whereRef = makeRangeQueriesFromServer(collectionRef, whereConfig);
  const scheduleList: ScheduleType[] = [];
  const querySnapshots = await whereRef
    .orderBy("date", "desc")
    .limit(limitNumber)
    .get();
  querySnapshots.docs.forEach((result) => {
    const fromDate = result.data()["date"];
    const toDate = result.data()["toDate"];
    // 기존 데이터 날짜 형식이 맞지 않는 경우 맞춰 주기 위함
    const reformDate = `${getReformDate(fromDate, ".")} (${l(
      getDay(getReformDate(fromDate, "."))
    )})`;
    // 기존 데이터에 to date가 없을 수 있음 (리뉴얼 하면서 신규 추가 됨)
    const reformToDate = toDate
      ? `${getReformDate(toDate, ".")} (${l(
          getDay(getReformDate(toDate, "."))
        )})`
      : "";
    scheduleList.push({
      id: result.id,
      date: reformDate,
      toDate: reformToDate,
      content: decrypt(result.data()["content"], uid + result.id) || "",
    });
  });
  // 조회 개수 제한 값보다 조회된 데이터가 적으면 더 이상 조회할 데이터가 없다고 판단 함
  const nextLastVisible =
    scheduleList.length < limitNumber
      ? null
      : querySnapshots.docs[querySnapshots.docs.length - 1].id;

  // 입력 폼에 사용된 텍스트를 서버에서 번역하여 전달하기 위한 값
  const componentsText: ComponentsTextType = {
    scheduleAddForm: {
      button: l("Add"),
      placeholder: l("Enter your schedule."),
      title: l("Enter schedule"),
    },
    scheduleEditForm: {
      resetButton: l("Reset"),
      editButton: l("Edit"),
      deleteButton: l("Delete"),
    },
  };

  return {
    lastVisible: nextLastVisible,
    dataList: scheduleList,
    componentsText: componentsText,
  };
};

export { queryScheduleDataFromServer };
