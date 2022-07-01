import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';
import { BaseCrudService } from './base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseCrudService<Notification> {
  constructor(injector: Injector) {
    super(injector);
    this.path = '/notification';
  }

  markAllAsRead():Observable<Notification>{
    return this.requestService.postJSON<Notification>(this.path + '/mark-read-all', {})
  }

  markAsRead(_id: string):Observable<Notification>{
    return this.requestService.postJSON<Notification>(this.path + '/mark-read/' + _id, {})
  }
}

