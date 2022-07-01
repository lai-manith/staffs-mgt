import { Session } from './session';
import { WeekDay } from './weekday';

export interface TableSession {
  days: WeekDay[];
  applied_session: Session;
  rotated_session: Session;
}
