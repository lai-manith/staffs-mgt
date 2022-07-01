import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, CityProvince } from '../models/address';
import { Nationality } from '../models/nationality';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class NationalityService extends BaseCrudService<Address>{

  constructor(injector: Injector) {
    super(injector);
    this.path = '/nationality';
  }

  getNationality() : Observable<Nationality[]>{
    return this.requestService.getJSON<Nationality[]>(this.path + '/nationality');
  }
}
