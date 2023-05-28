export type ScheduleAddFromTextProps = {
  button: string;
  placeholder: string;
  title: string;
} | null;

export type ScheduleEditFromTextProps = {
  resetButton: string;
  editButton: string;
  deleteButton: string;
} | null;

export interface ComponentsTextProps {
  scheduleAddForm: ScheduleAddFromTextProps;
  scheduleEditForm: ScheduleEditFromTextProps;
}