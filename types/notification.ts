import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  todoId: string;
  title: string;
  message: string;
  type: "reminder" | "deadline" | "overdue";
  read: boolean;
  createdAt: Timestamp;
}
