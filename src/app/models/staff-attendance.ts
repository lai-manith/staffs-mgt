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

export interface AttendanceStaffAttendances{
    _id?: string;
    time_tables?: string;
    shift_type?: number;
    attendance_type?: number;
    note?: string;
    staffs?: string;
    date?: Date;
}

// export interface AttendanceTimeTable{
//     _id: string;
//     weekdays?: number;
//     subjects?: Subject;
//     teachers?: Staff;
//     sessions?: Session;
// }

export interface AttendanceCreateModel{
    date?: string;
    list?: AttendanceList[];
}

export interface AttendanceList{
    staff?: string;
    shift_type?: number;
    attendance_type?: number;
}

export interface AttendanceHistoryResponse{
    attendance_info?: AttendanceInfo;
    staffs?: AttendanceHistoryStaffResponse[];
}

export interface AttendanceInfo{
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

export interface AttendanceHistoryStaffAttendanceResponse{
    date?: Date;
    attendances?: AttendanceList[];
}

// export interface AttendanceHistoryClassResponse{
//     _id?: string;
//     name?: string;
//     present_count?: number;
//     permission_count?: number;
//     absent_count?: number;
//     academic_years?: AcademicYear;
//     homeroom_teachers?: Staff;
// }

// export interface StudentAttendanceByClass {
//     _id?: string;
//     pass_fail: boolean;
//     classes: string;
//     grades: GradeScale;
//     academic_years: AcademicYear;
//     students: string;
//     total_attendance: number;
//     permission: number;
// }
// export interface StudentAttendanceData extends AttendanceStudentAttendances {
//     students: string;
//     classes: string
// }

// export interface StudentAttendanceDataList {
//     data: StudentAttendanceData[];
//     total: number;
//     absent: number;
//     permission: number;
// }
// export interface StudentAttendanceDetail {
//         students: Student;
//         classes: Class;
//         attendances: StudentAttendanceDataList;
// }

