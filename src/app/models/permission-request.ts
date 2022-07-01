import { Staff } from "./staff";
import { Student } from "./student";

export interface PermissionRequest {
  _id?: string;
  status?: number;
  start_date: string;
  end_date: string;
  start_shift: number;
  end_shift: number;
  reason: string;
  requester_staffs?: Staff;
  requester_students?: Student;
  schools?: string;
  file?: string;
  file_name?: string;
  remove_file?: boolean;
  reject_reason?: string;
  absent_count?: number;
  permission_count?: number;
  createdAt?: Date;
}
