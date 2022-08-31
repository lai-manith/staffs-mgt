export interface SimpleData {
  _id?: number;
  total?: number;
  total_male?: number;
  total_female?: number;
}

export interface GenderData {
  _id?: string;
  male_count?: number;
  female_count?: number;
  name?: string
}
export interface ReportStaffAgeGender {
  data?: SimpleData;
  report?: GenderData[];
}
