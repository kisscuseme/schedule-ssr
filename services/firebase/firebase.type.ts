import { WhereFilterOp } from "firebase/firestore";

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