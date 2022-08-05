import { Staff } from './staff';

export interface Attendance {
  _id: string;
  first_name?: string;
  last_name?: string;
  latin_name?: string;
  gender?: string;
  name?: string;
  titles?: any;
  attendances?: AttendanceStaffAttendances[];
}

export interface AttendanceStaffAttendances {
  _id?: string;
  time_tables?: string;
  shift_type?: number;
  attendance_type?: number;
  note?: string;
  staffs?: string;
  date?: Date;
}

export interface AttendanceCreateModel {
  date?: string;
  list?: AttendanceList[];
}

export interface AttendanceList {
  staff?: string;
  shift_type?: number;
  attendance_type?: number;
}

export interface AttendanceHistoryResponse {
  attendance_info?: AttendanceInfo;
  staffs?: AttendanceHistoryStaffResponse[];
}

export interface AttendanceInfo {
  absent_count?: number;
  permission_count?: number;
  present_count?: number;
  school_name?: string;
  staff_count?: number;
}

export interface AttendanceHistoryStaffResponse {
  _id?: string;
  first_name?: string;
  last_name?: string;
  latin_name?: string;
  gender?: string;
  name?: string;
  titles?: any;
  attendances?: AttendanceHistoryStaffAttendanceResponse[];
}

export interface AttendanceHistoryStaffAttendanceResponse {
  date?: Date;
  attendances?: AttendanceList[];
}

export interface AttendanceHistory {
  attendance_total: AttendanceType;
  staff: Staff[] & AttendanceType;
}

export interface AttendanceType {
  present: number;
  absent: number;
  permit: number;
}

export interface AttendanceResponse {
  _id: string;
  createAt: Date;
  staff: Staff
  shift_type: number;
  attendance_type: number;
}
