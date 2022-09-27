import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import {
  Attendance,
  AttendanceCreateModel,
  AttendanceHistory,
  AttendanceResponse
} from '../models/staff-attendance';
import { BaseDatatable } from '../models/datatables/base.datatable';

@Injectable({
  providedIn: 'root'
})
export class StaffAttendanceService extends BaseCrudService<Attendance> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/attendance/staff';
  }

  getAttendance(data: {
    [key: string]: any;
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<BaseDatatable<Attendance>> {
    return this.requestService.getJSON<BaseDatatable<Attendance>>(this.path, { data, is_loading: true});
  }

  createAttendance(data: AttendanceCreateModel): Observable<AttendanceCreateModel> {
    return this.requestService.postJSON<AttendanceCreateModel>('/attendance', { data });
  }

  getHistory(data: {
    [key: string]: any;
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Observable<AttendanceHistory> {
    return this.requestService.getJSON<AttendanceHistory>(this.path + '/history', { data });
  }

  getHistoryRecord(data: {
    [key: string]: any;
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    staff: string;
  }): Observable<BaseDatatable<AttendanceResponse>> {
    return this.requestService.getJSON<BaseDatatable<AttendanceResponse>>(this.path + '/history_record', { data });
  }
}
