import { ClassRoom } from "./class-room";
import { Subject } from "./subject";

export interface WeekDay {
  _id?: string;
  day: number;
  subject: Subject;
  classroom: ClassRoom;
}
