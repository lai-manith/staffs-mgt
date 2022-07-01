import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDatatable } from '../models/datatables/base.datatable';
import { Staff } from '../models/staff';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService extends BaseCrudService<Staff> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/staff';
  }

  getAll(data: {
    [key: string]: any;
    search?: string;
    page?: number;
    limit?: number;
    status?: boolean;
    image_size?: number;
    gender?: string;
    position?: string;
  }): Observable<BaseDatatable<Staff>> {
    return this.requestService.getJSON<BaseDatatable<Staff>>(this.path, { data });
  }

  getOne(
    _id: string,
  ): Observable<Staff> {
    return this.requestService.getJSON<Staff>(this.path + '/' + _id);
  }

  getFilter(): Observable<string[]> {
    return this.requestService.getJSON<string[]>(this.path + '/filter/status');
  }

  postFile(data: Staff) {
    return this.requestService.postFile<Staff>(this.path, { data });
  }

  updateFile(_id: string, data: Staff) {
    return this.requestService.patchFile<Staff>(this.path + '/' + _id, { data });
  }

  setStatus(_id: string): Observable<Staff> {
    return this.requestService.patchJSON<Staff>(this.path + '/' + _id + '/set_status', {});
  }

  getStaffCalendarExpired(data: {
    start_date: string;
    end_date: string;
    image_size: 200;
  }): Observable<BaseDatatable<Staff>> {
    return this.requestService.getJSON<BaseDatatable<Staff>>('/calendar', { data });
  }
}
