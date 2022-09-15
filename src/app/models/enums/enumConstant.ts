export default class EnumConstant {
  public static readonly ACTIVE = 1;
  public static readonly INACTIVE = 0;
  public static readonly DISABLED = -2;
  public static readonly APPROVED = 1;
  public static readonly REQUESTED = 4;
  public static readonly PENDING = 5;
  public static readonly REJECTED = -4;
  public static readonly DELETE = -9;
  public static readonly CANCEL = 9;

  public static readonly PUBLIC = 1;
  public static readonly DRAFT = 2;
  public static readonly DISABLE_OWN = -1;
  public static readonly REQUESTING = 3;
  public static readonly REJECT = -3;
  public static readonly UNPUBLISHED = -1;

  public static readonly Attendance = {
    PRESENT: 1,
    ABSENT: 2,
    PERMISSION: 3,
    LATE: 4
  };

  public static readonly Gender = {
    MALE: 'male',
    FEMALE: 'female'
  };

  public static readonly Enrolment = {
    NA: 0,
    PASSED: 1,
    FAILED: -1,
    DELETE_NAME: -8
  };

  public static readonly ReadPermission = {
    PUBLIC: 1,
    PRIVATE: -1
  };

  public static readonly academicType = {
    SHORT_COURSE: 'short_course',
    PROGRAM: 'program'
  };

  public static readonly Announcement = {
    MINISTRY: 'ministry',
    SCHOOL: 'school',
    STUDENT: 'student'
  };
  static ScoreResultEnum: any;
}

export enum Role {
  ALL = 'all',
  ADMIN = 'admin',
  SCHOOL = 'school',
  TEACHER = 'teacher',
  STUDENT = 'student',
  REVIEWER = 'reviewer',
  PARENT = 'parent',
  OFFICER = 'officer',
  DEPARTMENT = 'department'
}

export enum RoleId {
  ADMIN = 1,
  SCHOOL = 2,
  TEACHER = 4,
  STUDENT = 3,
  REVIEWER = 5,
  DEPARTMENT = 6,
  PARENT = 7
}

export enum UserStatusEnum {
  active = 1,
  pending = 0,
  inactive = -1
}

export enum ClassSubjectStatus {
  DEFAULT = 1,
  ADDED = 0
}

export enum ScoreResultEnum {
  'N/A' = null,
  PASSED = 1,
  FAILED = -1
}

export enum Attendance {
  PRESENT = 1,
  ABSENT = 2,
  PERMIT = 3,
  LATE = 4
}

export enum HistoryActionEnum {
  CHANGE_PASSWORD = 'change password',
  LOGIN = 'login',
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update'
}
