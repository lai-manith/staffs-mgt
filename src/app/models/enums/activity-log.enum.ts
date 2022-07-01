export enum ActivityLogEnum {
    LOGIN = 'login',
    UPDATE_INFO = 'update_info',
    RESET_PWD = 'reset_pwd',
    CHANGE_PWD = 'change_pwd',
}
export enum SchoolObjectLogEnum {
    UPDATE_INFO = 'update_info',
    CLASS = 'class',
    CLONE_CLASS = 'clone_class',
    APPROVED_ENROLMENT = 'approved_enrolment_submit',
    ANNOUNCEMENT = 'announcement',
    BUILDING = 'building',
    ROOM = 'room',
    SHIFT = 'shift',
    REJECTED_ENROLMENT = 'rejected_enrolment_submit',
    CANCEL_ENROLMENT = 'cancel_enrolment_submit',
}
export enum ActionLogEnum {
    LOGIN = 'login',
    CREATE = 'create',
    DELETE = 'delete',
    UPDATE = 'update',
    APPROVE = 'approve',
    REJECT = 'reject',
    CANCEL = 'cancel',
}