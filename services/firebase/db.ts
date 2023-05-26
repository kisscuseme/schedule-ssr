import {
  and,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  startAfter,
  where,
  writeBatch,
} from "firebase/firestore";
import { getReformDate } from "../util/util";
import { firebaseDb } from "./firebase";
import { ScheduleType, WhereConfigType } from "./firebase.type";

const limitNumber = 15;

const getFullPath = (uid: string) => {
  const language: string = "KR";
  const dbRootPath: string = "language/" + language;
  return dbRootPath + "/user/" + uid + "/schedule";
};

const makeRangeQuery = (whereConfig: WhereConfigType[]) => {
  const conditions = [];
  for (const condition of whereConfig) {
    conditions.push(
      where(condition.field, condition.operator, condition.value)
    );
  }
  return and(...conditions);
};

const getLastVisible = async (uid: string, docId: string) => {
  return await getDoc(doc(firebaseDb, getFullPath(uid), docId));
};

const queryScheduleData = async (
  whereConfig: WhereConfigType[],
  uid: string,
  lastVisible: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | string | null
) => {
  const fullPath = getFullPath(uid);
  const currentQuery =
    lastVisible !== null
      ? query(
          collection(firebaseDb, fullPath),
          makeRangeQuery(whereConfig),
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(limitNumber)
        )
      : query(
          collection(firebaseDb, fullPath),
          makeRangeQuery(whereConfig),
          orderBy("date", "desc"),
          limit(limitNumber)
        );
  const documentSnapshots = await getDocs(currentQuery);
  const scheduleList: ScheduleType[] = [];
  documentSnapshots.forEach((result) => {
    const reformDate = getReformDate(result.data()["date"], ".");
    const reformToDate = result.data()["toDate"]
      ? getReformDate(result.data()["toDate"], ".")
      : undefined;
    scheduleList.push({
      id: result.id,
      date: reformDate,
      toDate: reformToDate,
      content: result.data()["content"],
    });
  });

  const nextLastVisible =
    scheduleList.length < limitNumber
      ? null
      : documentSnapshots.docs[documentSnapshots.docs.length - 1];
  return {
    lastVisible: nextLastVisible,
    dataList: scheduleList,
  };
};

const updateScheduleData = async (updateInfo: {
  uid: string;
  scheduleId: string;
  newSchedule: object;
}) => {
  try {
    await runTransaction(firebaseDb, async (transaction) => {
      const fullPath = getFullPath(updateInfo.uid);
      const scheduleDocRef = doc(firebaseDb, fullPath, updateInfo.scheduleId);
      const scheduleDoc = await transaction.get(scheduleDocRef);
      if (!scheduleDoc.exists()) {
        throw "Document does not exist!";
      }
      const updateSchedule = {
        ...scheduleDoc.data(),
        ...updateInfo.newSchedule,
      };
      transaction.update(scheduleDocRef, updateSchedule);
    });
    // console.log("Transaction successfully committed!");
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
};

const insertScheduleData = async (insertInfo: {
  uid: string;
  newSchedule: object;
}) => {
  const fullPath = getFullPath(insertInfo.uid);

  // Get a new write batch
  const batch = writeBatch(firebaseDb);

  const docRef = doc(collection(firebaseDb, fullPath));
  const scheduleRef = doc(firebaseDb, fullPath, docRef.id);
  batch.set(scheduleRef, insertInfo.newSchedule);

  // Commit the batch
  await batch.commit();

  return docRef.id;
};

const deleteScheduleData = async (deleteInfo: {
  uid: string;
  scheduleId: string;
}) => {
  const fullPath = getFullPath(deleteInfo.uid);

  // Get a new write batch
  const batch = writeBatch(firebaseDb);

  const scheduleRef = doc(firebaseDb, fullPath, deleteInfo.scheduleId);
  batch.delete(scheduleRef);

  // Commit the batch
  await batch.commit();
};

export {
  queryScheduleData,
  getFullPath,
  updateScheduleData,
  insertScheduleData,
  deleteScheduleData,
  limitNumber,
  getLastVisible,
};