import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { StaffDayOff } from '../models/calendar';
import { BaseDatatable } from '../models/datatables/base.datatable';
import { Staff } from '../models/staff';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends BaseCrudService<StaffDayOff> {

  constructor(injector: Injector) {
    super(injector);
    this.path = '/calendar/day-off';
  }

}
