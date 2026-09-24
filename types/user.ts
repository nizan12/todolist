import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  timezone: string;
  createdAt?: Timestamp;
}
