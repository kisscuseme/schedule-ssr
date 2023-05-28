import {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  WhereFilterOp,
} from "firebase/firestore";

// alert type
export interface AlertType {
  title?: string;
  content?: React.ReactNode;
  callback?: () => void;
  confirm?: () => void;
  show: boolean;
}

// schedule input type
export interface ScheduleInputType {
  toDate: string;
  fromDate: string;
  schedule: string;
  id?: string;
}

// lastvisible type
export type LastVisibleType =
  | QueryDocumentSnapshot<DocumentData>
  | DocumentSnapshot<DocumentData>
  | string
  | null;

// firebase schedule data type
export type ScheduleType = {
  id?: string;
  date: string;
  content: string;
  toDate?: string;
} | null;

// user type
export type UserType = {
  uid: string;
  name: string;
  email: string;
} | null;

// where config type
export type WhereConfigType = {
  field: string;
  operator: WhereFilterOp;
  value: any;
};

// schedule add form text type
export type ScheduleAddFormTextType = {
  button: string;
  placeholder: string;
  title: string;
} | null;

// schedule edit form text type
export type ScheduleEditFormTextType = {
  resetButton: string;
  editButton: string;
  deleteButton: string;
} | null;

// components text type
export interface ComponentsTextType {
  scheduleAddForm: ScheduleAddFormTextType;
  scheduleEditForm: ScheduleEditFormTextType;
}
