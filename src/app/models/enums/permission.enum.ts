export enum studio {
  admin = 'studio.admin',
  teacher = 'studio.teacher'
}

export enum sAcademic {
  read = 's.academc_year.read'
}

export enum sAnnouncement {
  read = 's.announcement.read',
  writeAny = 's.announcement.writeAny',
  writeClass = 's.announcement.writeClass',
  writeStaff = 's.announcement.writeStaff',
  writeStudent = 's.announcement.writeStudent',
  deleteAny = 's.announcement.deleteAny',
  deleteRelate = 's.announcement.deleteRelate'
}

export enum sAttendance {
  readSelf = 's.attendance.readSelf',
  readStaff = 's.attendance.readStaff',
  writeStaff = 's.attendance.writeStaff',
  readStudent = 's.attendance.readStudent',
  writeStudent = 's.attendance.writeStudent'
}

export enum sBuilding {
  read = 's.building.read',
  write = 's.building.write',
  delete = 's.building.delete'
}

export enum sCalendar {
  read = 's.calendar.read',
  write = 's.calendar.write',
  delete = 's.calendar.delete'
}

export enum sClassEnrolment {
  read = 's.classEnrolment.read',
  write = 's.classEnrolment.write',
  delete = 's.classEnrolment.delete',
  relateClass = 's.classEnrolment.relateClass',
  changeClass = 's.classEnrolment.changeClass',
  deleteName = 's.classEnrolment.deleteName'
}

export enum sClass {
  readAny = 's.class.readAny',
  readTeaching = 's.class.readTeaching',
  write = 's.class.write',
  clone = 's.class.clone',
  delete = 's.class.delete'
}

export enum sDashboard {
  mainCount = 's.dashboard.mainCount',
  studentAttend = 's.dashboard.studentAttend',
  staffAttend = 's.dashboard.staffAttend',
  requiredInput = 's.dashboard.requiredInput'
}

export enum sEnrolmentSubmit {
  read = 's.enrolmentSubmit.read',
  readSchool = 's.enrolmentSubmit.readSchool',
  request = 's.enrolmentSubmit.request',
  approval = 's.enrolmentSubmit.approval'
}

export enum sFinalExam {
  read = 's.finalExam.read',
  write = 's.finalExam.write',
  request = 's.finalExam.request',
  deleteSubject = 's.finalExam.deleteSubject'
}

export enum sGradeDefine {
  read = 's.gradeDefine.read',
  write = 's.gradeDefine.write',
  delete = 's.gradeDefine.delete'
}

export enum sGradeScale {
  read = 's.gradeScale.read'
}

export enum sGrade {
  read = 's.grade.read'
}

export enum sPermissionRequest {
  readSelf = 's.permissionRequest.readSelf',
  read = 's.permissionRequest.read',
  write = 's.permissionRequest.write',
  delete = 's.permissionRequest.delete',
  approval = 's.permissionRequest.approval',
  readStudent = 's.permissionRequest.readStudent',
  approvalStudent = 's.permissionRequest.approvalStudent'
}

export enum sReport {
  passFail = 's.report.passFail',
  gender = 's.report.gender',
  attendance = 's.report.attendance',
  age = 's.report.age',
  class = 's.report.class',
  staffAgeGender = 's.report.staffAgeGender',
  studentGradeScale = 's.report.studentGradeScale'
}

export enum sRollOver {
  read = 's.rollOver.read',
  write = 's.rollOver.write'
}

export enum sRoom {
  read = 's.room.read',
  write = 's.room.write',
  delete = 's.room.delete'
}

export enum sSchool {
  read = 's.school.read',
  readAny = 's.school.readAny',
  write = 's.school.write'
}

export enum sScoreRecord {
  read = 's.scoreRecord.read',
  write = 's.scoreRecord.write',
  delete = 's.scoreRecord.delete'
}

export enum sScore {
  write = 's.score.write',
  readTeaching = 's.score.readTeaching'
}

export enum sShift {
  read = 's.shift.read',
  write = 's.shift.write',
  delete = 's.shift.delete'
}

export enum sStaffTransfer {
  read = 's.staffTransfer.read',
  write = 's.staffTransfer.write'
}

export enum sStaff {
  read = 's.staff.read',
  readTimeTable = 's.staff.readTimeTable',
  readAnyRole = 's.staff.readAnyRole',
  readLimitRole = 's.staff.readLimitRole',
  writeAnyRole = 's.staff.writeAnyRole',
  writeLimitRole = 's.staff.writeLimitRole',
  resetPwd = 's.staff.resetPwd',
  setActive = 's.staff.setActive',
  class = 's.staff.class',
  changeRole = 's.staff.changeRole'
}

export enum sStudent {
  write = 's.student.write',
  writeCsv = 's.student.writeCsv',
  resetPwd = 's.student.resetPwd',
  disable = 's.student.disable',
  read = 's.student.read',
  readOne = 's.student.readOne',
  readGrading = 's.student.readGrading',
  readAttendance = 's.student.readAttendance',
  readClass = 's.student.readClass',
  writeClass = 's.student.writeClass',
  readAll = 's.student.readAll',
  add = 's.student.add',
  delete = 's.student.delete'
}

export enum sStudyLevel {
  read = 's.studyLevel.read'
}

export enum sSubject {
  read = 's.subject.read',
  write = 's.subject.write',
  delete = 's.subject.delete'
}

export enum sTimeTable {
  read = 's.timeTable.read',
  readCreation = 's.timeTable.creationData',
  write = 's.timeTable.write',
  delete = 's.timeTable.delete',
  readClass = 's.timeTable.readClass',
  readSession = 's.timeTable.readSession',
  readTimetableAvailable = 's.timeTable.timetable_available'
}

export enum sTitle {
  read = 's.title.read'
}

export enum sUserLog {
  read = 's.userLog.read'
}

export enum sSchoollog {
  read = 's.schoolLog.read'
}

// school
// ["s.academc_year.read", "s.announcement.read", "s.announcement.write", "s.announcement.delete", "s.attendance.readStaff", "s.attendance.writeStaff", "s.attendance.readStudent", "s.attendance.writeStudent", "s.building.read", "s.building.write", "s.building.delete", "s.calendar.read", "s.calendar.write", "s.calendar.delete", "s.classEnrolment.read", "s.classEnrolment.write",
//     "s.classEnrolment.delete", "s.classEnrolment.relateClass", "s.classEnrolment.changeClass", "s.classEnrolment.deleteName", "s.class.read", "s.class.write", "s.class.clone", "s.class.delete", "s.dashboard.mainCount", "s.dashboard.studentAttend", "s.dashboard.staffAttend", "s.enrolmentSubmit.read", "s.enrolmentSubmit.readSchool", "s.enrolmentSubmit.request", "s.enrolmentSubmit.approval",
//     "s.finalExam.read", "s.finalExam.write", "s.finalExam.request", "s.finalExam.deleteSubject", "s.gradeDefine.read", "s.gradeDefine.write", "s.gradeDefine.delete", "s.gradeScale.read", "s.grade.read", "s.report.passFail", "s.report.gender", "s.report.attendance", "s.report.age", "s.report.class", "s.report.staffAgeGender", "s.report.studentGradeScale", "s.rollOver.read", "s.rollOver.write",
//     "s.room.read", "s.room.write", "s.room.delete", "s.school.read", "s.school.readAny", "s.school.write", "s.scoreRecord.read", "s.scoreRecord.write", "s.scoreRecord.delete", "s.score.write", "s.shift.read", "s.shift.write", "s.shift.delete", "s.staffTransfer.read", "s.staffTransfer.write", "s.staff.read", "s.staff.readTimeTable", "s.staff.readRole", "s.staff.write", "s.staff.resetPwd",
//     "s.staff.setActive", "s.staff.class", "s.staff.changeRole", "s.student.write", "s.student.writeCsv", "s.student.resetPwd", "s.student.disable", "s.student.read", "s.student.readGrading", "s.student.readAttendance", "s.student.readClass", "s.student.writeClass", "s.student.readAll", "s.student.add", "s.student.delete", "s.studyLevel.read", "s.subject.read", "s.subject.write",
//     "s.subject.delete", "s.timeTable.read", "s.timeTable.creationData", "s.timeTable.write","s.timeTable.delete","s.timeTable.readClass","s.timeTable.readSession","s.title.read"]

//teacher
// ["s.academc_year.read", "s.announcement.read", "s.announcement.write", "s.announcement.delete",  "s.attendance.readStudent", "s.attendance.writeStudent", "s.building.read", "s.calendar.read", "s.classEnrolment.read",
//     "s.classEnrolment.deleteName", "s.class.read", "s.dashboard.mainCount", "s.enrolmentSubmit.read", "s.enrolmentSubmit.request", "s.gradeDefine.read", "s.gradeScale.read",
//     "s.room.read", "s.school.read", "s.scoreRecord.read", "s.scoreRecord.write", "s.scoreRecord.delete", "s.score.write", "s.shift.read",
//     "s.studyLevel.read", "s.subject.read", "s.timeTable.read","s.timeTable.readClass","s.timeTable.readSession","s.title.read"]

// officer
// ["s.academc_year.read", "s.announcement.read", "s.announcement.write", "s.announcement.delete", "s.attendance.readStaff", "s.attendance.writeStaff", "s.attendance.readStudent", "s.building.read", "s.building.write", "s.building.delete", "s.calendar.read", "s.calendar.write", "s.calendar.delete", "s.classEnrolment.read", "s.classEnrolment.write",
//     "s.classEnrolment.delete", "s.classEnrolment.relateClass", "s.classEnrolment.changeClass",  "s.class.read", "s.class.write", "s.class.clone", "s.class.delete", "s.dashboard.mainCount", "s.dashboard.studentAttend", "s.dashboard.staffAttend", "s.enrolmentSubmit.read", "s.enrolmentSubmit.readSchool", "s.enrolmentSubmit.approval",
//     "s.finalExam.read", "s.finalExam.write", "s.finalExam.request", "s.finalExam.deleteSubject", "s.gradeDefine.read", "s.gradeDefine.write", "s.gradeDefine.delete", "s.gradeScale.read", "s.grade.read", "s.report.passFail", "s.report.gender", "s.report.attendance", "s.report.age", "s.report.class", "s.report.staffAgeGender", "s.report.studentGradeScale", "s.rollOver.read", "s.rollOver.write",
//     "s.room.read", "s.room.write", "s.room.delete", "s.school.read", "s.school.readAny", "s.school.write", "s.shift.read", "s.shift.write", "s.shift.delete", "s.staffTransfer.read", "s.staffTransfer.write", "s.staff.read", "s.staff.readTimeTable", "s.staff.readRole", "s.staff.write", "s.staff.resetPwd",
//     "s.staff.setActive", "s.staff.class", "s.staff.changeRole", "s.student.write", "s.student.writeCsv", "s.student.resetPwd", "s.student.disable", "s.student.read", "s.student.readGrading", "s.student.readAttendance", "s.student.readClass", "s.student.writeClass", "s.student.readAll", "s.student.add", "s.student.delete", "s.studyLevel.read", "s.subject.read", "s.subject.write",
//     "s.subject.delete", "s.timeTable.read", "s.timeTable.creationData", "s.timeTable.write","s.timeTable.delete","s.timeTable.readClass","s.timeTable.readSession","s.title.read"]

//review
// ["s.academc_year.read", "s.announcement.read","s.attendance.readStaff", "s.attendance.readStudent", "s.building.read","s.calendar.read", "s.classEnrolment.read",
//     "s.classEnrolment.relateClass", "s.class.read", "s.dashboard.mainCount", "s.dashboard.studentAttend", "s.dashboard.staffAttend", "s.enrolmentSubmit.read", "s.enrolmentSubmit.readSchool",
//     "s.finalExam.read", "s.gradeDefine.read", "s.gradeScale.read", "s.grade.read", "s.report.passFail", "s.report.gender", "s.report.attendance", "s.report.age", "s.report.class", "s.report.staffAgeGender", "s.report.studentGradeScale", "s.rollOver.read",
//     "s.room.read", "s.school.read", "s.school.readAny","s.scoreRecord.read", "s.shift.read", "s.staffTransfer.read", "s.staff.read", "s.staff.readTimeTable", "s.staff.readRole",
//     "s.staff.class","s.student.read", "s.student.readGrading", "s.student.readAttendance", "s.student.readClass", "s.student.readAll", "s.studyLevel.read", "s.subject.read",
//     "s.timeTable.read", "s.timeTable.creationData", "s.timeTable.readClass","s.timeTable.readSession","s.title.read"]
