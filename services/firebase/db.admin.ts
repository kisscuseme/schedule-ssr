import { getReformDate } from "../util/util";
import { ScheduleType, WhereConfigType } from "./firebase.type";
import { admin } from "./firebase.admin";
import { getFullPath, limitNumber } from "./db";

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
    const reformDate = getReformDate(result.data()["date"], ".");
    const reformToDate = result.data()["toDate"]?getReformDate(result.data()["toDate"], "."):undefined;
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
    dataList: scheduleList
  };
}

export {
  queryScheduleDataFromServer
};