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

export interface PositionData {
  _id?: string;
  total_male?: number;
  total_female?: number;
  name?: string
}
export interface ReportStaffAgeGender {
  data?: SimpleData;
  report?: GenderData[];
}

export interface ReportStaffPosition {
  data?: SimpleData;
  report?: PositionData[];
}

export interface ReportCityProvince {
  count?: number;
  name?: string;
  _id?: string;
}
