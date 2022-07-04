import { Staff } from "./staff";

export interface ManageContract {
  _id?: string;
  createAt?: Date;
  status?: number | string;
  staff?: Staff,
  current_expired_contract?: Date;
  new_expired_contract?: Date;
  duration?: string;
}
