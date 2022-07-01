import { Injectable, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseDatatable } from '../models/datatables/base.datatable';
import { CheckDuplicated, User } from '../models/user';
import { LinkEmailRequest } from '../models/verify-email';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService<User> {
  private subject = new Subject<User>();
  constructor(injector: Injector) {
    super(injector);
    this.path = '/user';
  }

  getAll(data: {
    [key: string]: any;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<BaseDatatable<User>> {
    return this.requestService.getJSON<BaseDatatable<User>>(this.path, { data });
  }

  getOne(_id: string): Observable<User> {
    return this.requestService.getJSON<User>(this.path + '/' + _id);
  }

  postFile(data: User) {
    return this.requestService.postFile<User>(this.path + '/register', { data });
  }

  updateFile(_id: string, data: User) {
    return this.requestService.patchFile<User>(this.path + '/' + _id, { data });
  }

  setAccountStatus(_id: string, data: User): Observable<User> {
    return this.requestService.patchJSON<User>(this.path + '/' + _id + '/set_status', { data });
  }

  changePassword(_id: string, data: User): Observable<User> {
    return this.requestService.patchJSON<User>(this.path + '/' + _id + '/change_password', {
      data
    });
  }

  checkDuplicated(data: { username?: string }): Observable<CheckDuplicated> {
    return this.requestService.getJSON<CheckDuplicated>(this.path + '/account/check/username', { data });
  }

  getUserLoggedInfo(): Observable<User> {
    return this.requestService.getJSON<User>(this.path + '/account/info');
  }

  get(): Observable<User> {
    return this.subject.asObservable();
  }
  set(data: User) {
    this.subject.next(data);
  }

  linkEmailRequest(data: { _id: string, email: string }): Observable<LinkEmailRequest> {
    return this.requestService.postJSON(
      this.path + '/verify/request_otp', { data }
    );
  }

  linkEmailAccount(data: { _id: string, otp_number: number }) {
    return this.requestService.postJSON(
      this.path + '/verify/match_otp', { data }
    );
  }

  changeEmailRequest(data: { _id: string, otp_number: number }) {
    return this.requestService.postJSON(
      this.path + '/verify/change_email', { data }
    );
  }

  /**
   * @deprecated The method should not be used
   */
  delete(_id: string) {
    return null;
  }
}
