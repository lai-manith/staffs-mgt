import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ManageContract } from '../models/contract';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService  extends BaseCrudService<ManageContract> {

  constructor(injector: Injector) {
    super(injector);
    this.path = '/contract';
  }

  updateContract(_id: string, data: {new_expired_contract: Date}):Observable<ManageContract>{
    return this.requestService.patchJSON<ManageContract>(this.path + '/' + _id, { data })
  }

}
