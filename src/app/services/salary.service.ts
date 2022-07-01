import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ManageSalary } from '../models/salary';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryService extends BaseCrudService<ManageSalary> {

  constructor(injector: Injector) {
    super(injector);
    this.path = '/salary';
  }

  updateSalary(_id: string, data: {salary: number}):Observable<ManageSalary>{
    return this.requestService.patchJSON<ManageSalary>('/staff/update_salary/' + _id, { data })
  }

}
