import { Address, Nationality } from "./address";
import { Position } from "./position";

export interface Staff {
  _id?: string;
  staff_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  phone: number;
  email?: string;
  address: Address;
  place_of_birth: Address;
  profile?: string;
  position: Position;
  hire_date: Date;
  contract_expiry_date: Date;
  date_of_birth: Date;
  salary: number;
  status: any;
  create_at?: Date;
  update_at?: Date;
  attach_files: string;
  file_name: string;
  nationality?: Nationality;
  ethnicity?: Nationality;
  contract_duration?: string;
  id_card: number;
  stop_working_date?: Date;
  month_worked?: Date;

  is_check?: boolean;
}
