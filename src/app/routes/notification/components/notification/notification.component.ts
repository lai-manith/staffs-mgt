import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/models/enums/notification-type';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { NotificationDataSourceService } from 'src/app/services/notification-datasource.service';
import { formatDate } from '@angular/common';
import { Unsubscribe } from 'src/app/helpers/unsubscribe';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends Unsubscribe {
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    super();
  }

  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  notificationTypes = NotificationType;
  notifications = [];
  notificationDetail: any;
  dataSource: NotificationDataSourceService;
  @Input() routeId: number;
  @ViewChild('buttonTrigger') button: MatMenuTrigger;
  imgDefault: string = 'assets/imgs/profile-default.svg';

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.routeId) {
      NotificationDataSourceService.isOpen = false;
      this.dataSource = new NotificationDataSourceService(this.notificationService);
    }
  }

  menuOpened() {
    NotificationDataSourceService.isOpen = true;
    this.dataSource = new NotificationDataSourceService(this.notificationService);
    //used to prevent when remove the menu from the dom and lost data
    this.cdkVirtualScrollViewport.setRenderedContentOffset(0);
    //set  10 items to be rendered
    this.cdkVirtualScrollViewport.setRenderedRange({ start: 0, end: 9 });
  }

  goToNotificationSource(data: Notification) {
    setTimeout(() => {
      if (data.read === 0) {
        this.notificationService.getById(data._id).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.navigateTo(data);
        });
      } else {
        this.navigateTo(data);
      }
    }, 200);
  }

  navigateTo(data: Notification) {
    this.router.navigate(['calendar/' + formatDate(data.create_at, 'MM-dd-yy', 'en-US')]);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.dataSource = new NotificationDataSourceService(this.notificationService);
      },
      error: err => {
        this.snackbarService.onShowSnackbar({
          message: err.error?.errors instanceof Array ? err.error?.errors[0].msg : err.error?.message,
          component: SnackbarComponent,
          isError: true
        });
      }
    });
  }

  onMarkRead(id: string): void {
    this.button.closeMenu();

    this.notificationService.markAsRead(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.dataSource = new NotificationDataSourceService(this.notificationService);
      },
      error: err => {
        this.snackbarService.onShowSnackbar({
          message: err.error?.errors instanceof Array ? err.error?.errors[0].msg : err.error?.message,
          component: SnackbarComponent,
          isError: true
        });
      }
    });
  }

  onDelete(id: string, status: number): void {
    if (status === 1) this.button.closeMenu();

    this.notificationService.delete(id).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.dataSource = new NotificationDataSourceService(this.notificationService);
      },
      error: err => {
        this.snackbarService.onShowSnackbar({
          message: err.error?.errors instanceof Array ? err.error?.errors[0].msg : err.error?.message,
          component: SnackbarComponent,
          isError: false
        });
      }
    });
  }
}
