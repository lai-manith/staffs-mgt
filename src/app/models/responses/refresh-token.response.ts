import { BaseResponse } from './base.response';

export interface RefreshTokenResponse extends BaseResponse {
  data: {
    token: string;
  };
}
