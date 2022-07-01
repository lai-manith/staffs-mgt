import { Staff } from "./staff";

export interface Notification {
  _id?: string;
  title?: string;
  staff?: Staff;
  description?: string;
  create_at?: Date;
  read?: number;
  message?: string;
}

