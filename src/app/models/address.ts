export interface Address {
  city_provinces?: any,
  districts?: any,
  communes?: any,
  villages?: any,
  detail?: string,
  street?: string,
  house_number?: string
}


export interface CityProvinces {
    _id?: number;
    name: string;
}

export interface Districts {
    _id?: number;
    name: string;
    city_provinces: number;
}

export interface Communes {
    _id?: number;
    name: string;
    districts: number;
}

export interface Villages {
    _id?: number;
    name: string;
    communes: number;
    address?: string;
}

export interface Nationality {
    _id?: number;
    nationality_en?: string;
    nationality?: string;
    name?: string;
}

export interface Ethnicity {
    _id?: number;
    ethnicity_en?: string;
    ethnicity?: string;
    name?: string;
}
