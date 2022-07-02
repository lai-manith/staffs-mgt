export interface StaffByGender {
  total?: number;
  total_female?: number;
  total_male?: number;
}

export interface StaffByPosition {
  count?: number;
  name?: number;
  _id?: number;
}

export interface SalarySummary {
  max_salary?: number;
  min_salary?: number;
  salary_per_month?: number;
  salary_per_year?: number;
}
