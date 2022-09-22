import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDatatable } from '../models/datatables/base.datatable';
import { ReportCityProvince, ReportStaffAgeGender, ReportStaffPosition } from '../models/report';
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

  getStaffPosition(data: { year: string }): Observable<BaseDatatable<ReportStaffPosition>> {
    return this.requestService.getJSON<BaseDatatable<ReportStaffPosition>>(this.path + '/position_by_year', {
      data,
      is_loading: true
    });
  }

  getStaffCityProvince(data: { year: string }): Observable<BaseDatatable<ReportCityProvince>> {
    return this.requestService.getJSON<BaseDatatable<ReportCityProvince>>(this.path + '/city_province', {
      data,
      is_loading: true
    });
  }
}
