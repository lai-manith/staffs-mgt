export interface Filter {
  title?: string;
  use?: boolean;
  data: OptionValue[];
  labelFunc: string;
  selectedValue?: Option;
  selectedIndex?: number;
  matIcon?: string;
  svgIcon?: string;
  paramKey?: useFilter;
  isMultiple?: boolean;
  dep?: useFilter;
  hasSearch?: boolean;
  hasButton?: boolean;
}
export interface Option {
  value: any;
  label: string;
}
export interface OptionValue {
  value: string | null | number;
  label: string;
}

export interface OptionParam {
  value: any;
  labelParam: string;
  paramKey?: useFilter;
}

export type useFilter = 'gender' | 'status' | 'attendance_type' | 'shift_type' | 'staff' | 'position';
