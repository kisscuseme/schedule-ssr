import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, WhereFilterOp } from "firebase/firestore";

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

export type ScheduleType = {
  id: string
  date: string
  content: string
  toDate?: string
} | null;

export type UserType = {
  uid: string
  name: string
  email: string
} | null;

export type LoginStateType = boolean | null;

export type WhereConfigType = {
  field: string,
  operator: WhereFilterOp,
  value: any
}