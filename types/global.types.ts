import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

export interface AlertType {
  title?: string;
  content?: React.ReactNode;
  callback?: () => void;
  confirm?: () => void;
  show: boolean;
}

export interface ScheduleInputType {
  toDate: string,
  fromDate: string,
  schedule: string,
  id?: string
}

export type LastVisibleType = QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData> | string | null;