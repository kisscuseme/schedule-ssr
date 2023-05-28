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
import { decrypt, encrypt, getReformDate } from "../util/util";
import { firebaseDb } from "./firebase";
import { ScheduleType, WhereConfigType } from "@/types/types";

// 한 번에 조회할 데이터 개수 제한
const limitNumber = 15;

// 데이터가 위치한 db path 생성
const getFullPath = (uid: string) => {
  const language: string = "KR";
  const dbRootPath: string = "language/" + language;
  return dbRootPath + "/user/" + uid + "/schedule";
};

// firestore의 where 조건 생성
const makeRangeQuery = (whereConfig: WhereConfigType[]) => {
  const conditions = [];
  for (const condition of whereConfig) {
    conditions.push(
      where(condition.field, condition.operator, condition.value)
    );
  }
  return and(...conditions);
};

// 추가 데이터 조회 시 기준 점 오브젝트 조회 (서버와 클라이언트 데이터가 구조가 달라서 별도 조회 함)
const getLastVisible = async (uid: string, docId: string) => {
  return await getDoc(doc(firebaseDb, getFullPath(uid), docId));
};

// 클라이언트에서 firestore의 schedule 데이터를 조회
const queryScheduleData = async (
  whereConfig: WhereConfigType[],
  uid: string,
  lastVisible:
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>
    | string
    | null
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
    // 기존 데이터 날짜 형식이 맞지 않는 경우 맞춰 주기 위함
    // 요일은 새로고침 없이 언어 변경이 필요하므로 여기서 추가하지 않음
    const reformDate = getReformDate(result.data()["date"], ".");
    // 기존 데이터에 to date가 없을 수 있음 (리뉴얼 하면서 신규 추가 됨)
    const reformToDate = result.data()["toDate"]
      ? getReformDate(result.data()["toDate"], ".")
      : undefined;
    scheduleList.push({
      id: result.id,
      date: reformDate,
      toDate: reformToDate,
      content: decrypt(result.data()["content"], uid) || "",
    });
  });

  // 조회 개수 제한 값보다 조회된 데이터가 적으면 더 이상 조회할 데이터가 없다고 판단 함
  const nextLastVisible =
    scheduleList.length < limitNumber
      ? null
      : documentSnapshots.docs[documentSnapshots.docs.length - 1];
  return {
    lastVisible: nextLastVisible,
    dataList: scheduleList,
  };
};

// firebase 데이터 수정
const updateScheduleData = async (updateInfo: {
  uid: string;
  scheduleId: string;
  newSchedule: ScheduleType;
}) => {
  try {
    await runTransaction(firebaseDb, async (transaction) => {
      const fullPath = getFullPath(updateInfo.uid);
      const scheduleDocRef = doc(firebaseDb, fullPath, updateInfo.scheduleId);
      const scheduleDoc = await transaction.get(scheduleDocRef);
      if (!scheduleDoc.exists()) {
        throw "Document does not exist!";
      }
      if (updateInfo.newSchedule)
        updateInfo.newSchedule.content =
          encrypt(updateInfo.newSchedule.content, updateInfo.uid) ||
          updateInfo.newSchedule.content;
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

// firebase 데이터 추가
const insertScheduleData = async (insertInfo: {
  uid: string;
  newSchedule: ScheduleType;
}) => {
  const fullPath = getFullPath(insertInfo.uid);

  // Get a new write batch
  const batch = writeBatch(firebaseDb);

  const docRef = doc(collection(firebaseDb, fullPath));
  const scheduleRef = doc(firebaseDb, fullPath, docRef.id);
  if (insertInfo.newSchedule)
    insertInfo.newSchedule.content =
      encrypt(insertInfo.newSchedule.content, insertInfo.uid) ||
      insertInfo.newSchedule.content;
  batch.set(scheduleRef, insertInfo.newSchedule);

  // Commit the batch
  await batch.commit();

  return docRef.id;
};

// firebase 데이터 삭제
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
