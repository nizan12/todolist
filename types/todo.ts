import { Timestamp } from "firebase/firestore";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Timestamp | null;
  dueTime?: string | null;
  reminder?: {
    enabled: boolean;
    reminders: {
      minutesBefore: number;
      sent: boolean;
    }[];
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
