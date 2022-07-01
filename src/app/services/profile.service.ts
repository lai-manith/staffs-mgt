import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOTP } from '../models/otp';
import { User } from '../models/user';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseCrudService<User> {
  public staffId: string | undefined;
  constructor(injector: Injector) {
    super(injector);
    this.path = '/user';
  }

  getAccountInfo(): Observable<User> {
    return this.requestService.getJSON(this.path + '/account/info');
  }


  // updateMyInfo(data: Staff) {
  //   return this.requestService.patchFile<Staff>(this.path + '/info', { data });
  // }

  checkExistedUser(data: any) {
    return this.requestService.getJSON(this.path + '/check_existed_user', { data });
  }

  requestOTP(data: { email: string }) {
    return this.requestService.postJSON<RequestOTP>('/user' + '/forget_password/request_otp', { data: data });
  }

  verifyOTP(data: { otp_number: number }) {
    return this.requestService.postJSON('/user' + '/forget_password/match_otp', { data: data });
  }

  changePassword(data: { _id: string; password: string }) {
    return this.requestService.postJSON('/user' + '/forget_password/change_password', { data: data });
  }
}
