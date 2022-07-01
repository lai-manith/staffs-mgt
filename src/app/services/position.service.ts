import { Injectable, Injector } from '@angular/core';
import { Position } from '../models/position';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class PositionService extends BaseCrudService<Position> {

  constructor(injector: Injector) {
    super(injector);
    this.path = '/position';
  }

}
