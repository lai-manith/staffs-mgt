import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { Attendance, AttendanceCreateModel, AttendanceHistoryResponse } from '../models/staff-attendance';
import { BaseDatatable } from '../models/datatables/base.datatable';

@Injectable({
  providedIn: 'root'
})
export class StaffAttendanceService extends BaseCrudService<Attendance>{

    constructor(injector: Injector) {
        super(injector);
        this.path = '/attendance/staff';
    }

    createAttendance(data: AttendanceCreateModel): Observable<AttendanceCreateModel>{
        return this.requestService.postJSON<AttendanceCreateModel>(
            '/attendance', { data }
        );
    }

    getByRange(startDate: string, endDate: string): Observable<AttendanceHistoryResponse>{
        return this.requestService.getJSON<AttendanceHistoryResponse>(
            this.path + '/range?start_date=' + startDate + '&end_date=' + endDate
        );
    }

}
