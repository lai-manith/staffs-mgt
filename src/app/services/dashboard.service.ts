import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardGender } from '../models/dashboard';
import { BaseDatatable } from '../models/datatables/base.datatable';
import { Staff } from '../models/staff';
import { User } from '../models/user';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseCrudService<DashboardGender> {
  public staffId: string | undefined;
  constructor(injector: Injector) {
    super(injector);
    this.path = '/report';
  }

  getGender(): Observable<DashboardGender> {
    return this.requestService.getJSON(this.path + '/gender');
  }

  getNearlyExpiredStaff(data: {
    [key: string]: any;
    search?: string;
    page?: number;
    limit?: number;
    status?: boolean;
    image_size?: number;
    gender?: string;
    position?: string;
  }): Observable<BaseDatatable<Staff>> {
    return this.requestService.getJSON<BaseDatatable<Staff>>(this.path + '/staff-nearly-expired', { data })
  }
}
