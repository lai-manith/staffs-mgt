import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumConstant } from '../models/enums/enumConstant';
import { NotificationType } from '../models/enums/notification-type';
import { Notification } from '../models/notification';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationDataSourceService extends DataSource<
  Notification | undefined
> {
  cachedNotifications = Array.from<Notification>({ length: 0 });
  private dataStream = new BehaviorSubject<(Notification | undefined)[]>(
    this.cachedNotifications
  );
  private subscription = new Subscription();
  private pageSize = 10;
  private lastPage = 1;
  public unreadCount: number;
  public isLoading: boolean;
  static isOpen: boolean;
  message: string;
  constructor(private notificationService: NotificationService) {
    super();
    this._fetchNotificationPage();
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<
    (Notification | undefined)[] | ReadonlyArray<Notification | undefined>
  > {
    this.subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const currentPage = this._getPageForIndex(range.end);
        if (
          NotificationDataSourceService.isOpen &&
          currentPage == this.lastPage
        ) {
          this.lastPage++;
          this._fetchNotificationPage();
        }
      })
    );
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }

  private _fetchNotificationPage(): void {
    this.isLoading = true;
    this.notificationService
      .getMany({ limit: 10, page: this.lastPage })
      .pipe(
        map((map) => {
          map.list.forEach((element) => {
            const dateNow = new Date().setHours(0, 0, 0, 0);
            const date = new Date(element.create_at).setHours(0, 0, 0, 0);
            const message = dateNow === date ? 'ថ្ងៃនេះជាថ្ងៃឈប់សម្រាករបស់ ' : formatDate(element.create_at, 'dd-MM-yyyy', 'en-US') + ' ជាថ្ងៃឈប់សម្រាករបស់ ';
            element.message = message + '<strong>' + element.staff.first_name + ' ' + element.staff.last_name + '<strong>';
          });
          return map;
        })
      )
      .subscribe((res) => {
        this.cachedNotifications = this.cachedNotifications.concat(res.list);
        this.dataStream.next(this.cachedNotifications);
        this.unreadCount = res.total_unread;
        this.isLoading = false;
      });
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }
}
