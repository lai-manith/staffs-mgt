import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportStaffAgeGender } from '../models/report';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseCrudService<ReportStaffAgeGender> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/report';
  }

  getStaffAgeGender(data: { year: string }): Observable<ReportStaffAgeGender> {
    return this.requestService.getJSON<ReportStaffAgeGender>(this.path + '/gender_by_year', { data, is_loading: true });
  }
}
