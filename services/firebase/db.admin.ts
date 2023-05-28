import { getDay, getReformDate, l } from "../util/util";
import { admin } from "./firebase.admin";
import { getFullPath, limitNumber } from "./db";
import { ScheduleType, WhereConfigType } from "@/types/global.types";

const makeRangeQueryFromServer = (
  ref: admin.firestore.Query<admin.firestore.DocumentData>,
  condition: WhereConfigType) => {
    return ref.where(condition.field, condition.operator, condition.value);
}

const makeRangeQueriesFromServer = (
  ref: admin.firestore.Query<admin.firestore.DocumentData>,
  whereConfig: WhereConfigType[]) => {
  let whereRef = ref;
  for(const condition of whereConfig) {
    whereRef = makeRangeQueryFromServer(whereRef, condition);
  }
  return whereRef;
}

const queryScheduleDataFromServer = async (whereConfig: WhereConfigType[], uid: string) => {
  const fullPath = getFullPath(uid);
  const collectionRef = admin.firestore().collection(fullPath);
  const whereRef = makeRangeQueriesFromServer(collectionRef, whereConfig);
  const scheduleList: ScheduleType[] = [];
  const querySnapshots = await whereRef.orderBy("date", "desc").limit(limitNumber).get();
  querySnapshots.docs.forEach((result) => {
    const fromDate = result.data()["date"];
    const toDate = result.data()["toDate"];
    const reformDate = `${getReformDate(fromDate, ".")} (${l(getDay(getReformDate(fromDate, ".")))})`;
    const reformToDate = toDate ? `${getReformDate(toDate, ".")} (${l(getDay(getReformDate(toDate, ".")))})` : "";
    scheduleList.push({
      id: result.id,
      date: reformDate,
      toDate: reformToDate,
      content: result.data()["content"]
    });
  });
  const nextLastVisible = scheduleList.length < limitNumber ? null : querySnapshots.docs[querySnapshots.docs.length - 1].id;
  return {
    lastVisible: nextLastVisible,
    dataList: scheduleList,
    componentsText: {
      scheduleAddForm: {
        button: l("Add"),
        placeholder: l("Enter your schedule."),
        title: l("Enter schedule")
      },
      scheduleEditForm: {
        resetButton: l("Reset"),
        editButton:l("Edit"),
        deleteButton: l("Delete")
      }
    }
  };
}

export {
  queryScheduleDataFromServer,
};