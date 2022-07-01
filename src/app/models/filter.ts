export interface Filter {
  data: Option[];
  labelFunc: string;
  selectedValue?: Option;
  selectedIndex: number;
  matIcon?: string;
  svgIcon?: string;
  paramKey: string;
}
export interface Option {
  value: any;
  label: string;
}

export interface OptionParam {
  value: any;
  labelParam: string;
  paramKey?: string
}

