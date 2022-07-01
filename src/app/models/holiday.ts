export interface Holiday {
  _id?: string;
  status?: number;
  name: string;
  description: string;
  holiday_start_date?: Date;
  holiday_end_date?: Date;
  start_date: Date;
  end_date: Date;
  color: string;
  schools?: string;
  createdAt?: string;
  updatedAt?: string;
}
