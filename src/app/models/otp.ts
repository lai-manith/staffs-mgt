export interface RequestOTP {
  _id?: string;
  owner?: string;
  otp?: string;
  email?: string;
  expire_at?: Date;
}
