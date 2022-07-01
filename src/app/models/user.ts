export interface User {
    _id?: string;
    phone?: string;
    first_name: string;
    last_name: string;
    email?: string;
    role_id?: string;
    password?: string;
    titles?: {
        title: string;
        _id: string;
    };
    profile_image?: string;
    token?: string;
    refresh_token?: string;
    roles?: {
        role_name: string;
        status: number;
        _id: number;
        permissions?: string[];
    },
    role?: string;
    profile?: string;
    gender?: string;
    dob?: string;
    status?: any;
    verified?: boolean;
}

export interface CheckDuplicated {
  find?: boolean;
}
