import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CityProvinces, Districts, Communes, Villages, Nationality, Address } from '../models/address';
import { BaseDatatable } from '../models/datatables/base.datatable';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseCrudService<Address>{

  constructor(injector: Injector) {
    super(injector);
    this.path = '/address';
  }

  getCityProvince() : Observable<BaseDatatable<CityProvinces>>{
    return this.requestService.getJSON<BaseDatatable<CityProvinces>>(this.path + '/city_province');
  }

  getDistrict(_id: number) : Observable<BaseDatatable<Districts>>{
    return this.requestService.getJSON<BaseDatatable<Districts>>(this.path + '/district?city_province=' + _id);
  }

  getCommune(_id: number) : Observable<BaseDatatable<Communes>>{
    return this.requestService.getJSON<BaseDatatable<Communes>>(this.path + '/commune?district=' + _id);
  }

  getVillage(_id: number) : Observable<BaseDatatable<Villages>>{
    return this.requestService.getJSON<BaseDatatable<Villages>>(this.path + '/village?commune=' + _id);
  }

  getNationality() : Observable<BaseDatatable<Nationality>>{
    return this.requestService.getJSON<BaseDatatable<Nationality>>('/nationality');
  }

}
