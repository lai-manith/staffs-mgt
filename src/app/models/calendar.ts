import { Staff } from "./staff";

export interface StaffDayOff {
  _id?: string;
  day_off_date: Date;
  staff: Staff;
}
