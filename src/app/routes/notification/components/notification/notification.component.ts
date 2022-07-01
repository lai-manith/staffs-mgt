import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationType } from 'src/app/models/enums/notification-type';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { EnumConstant } from 'src/app/models/enums/enumConstant';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { NotificationDataSourceService } from 'src/app/services/notification-datasource.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserDataService } from 'src/app/services/user-data.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private userDataService: UserDataService
  ) {}

  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  notificationTypes = NotificationType;
  courseStatus = EnumConstant;
  notifications = [];
  notificationDetail: any;
  dataSource: NotificationDataSourceService;
  @Input() routeId: number;
  @ViewChild('buttonTrigger') button: MatMenuTrigger;
  imgDefault: string = 'https://res.cloudinary.com/dxrkctl9c/image/upload/v1638865473/image/user-icon_n2sii7.svg';

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.routeId) {
      NotificationDataSourceService.isOpen = false;
      this.dataSource = new NotificationDataSourceService(
        this.notificationService
      );
    }
  }

  menuOpened() {
    NotificationDataSourceService.isOpen = true;
    //used to prevent when remove the menu from the dom and lost data
    this.cdkVirtualScrollViewport.setRenderedContentOffset(0);
    //set  10 items to be rendered
    this.cdkVirtualScrollViewport.setRenderedRange({ start: 0, end: 9 });
  }

  goToNotificationSource(data: Notification) {
    setTimeout(() => {
      if (data.read === 0) {
        this.notificationService.getById(data._id).subscribe((res) => {
          this.navigateTo(data);
        });
      } else {
        this.navigateTo(data);
      }
    }, 200);
  }

  navigateTo(data: Notification) {
    this.router.navigate(['calendar']);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.dataSource = new NotificationDataSourceService(
          this.notificationService
        );
      },
      error: (err) => {
        this.snackbarService.onShowSnackbar({
          message:
            err.error?.errors instanceof Array
              ? err.error?.errors[0].msg
              : err.error?.message,
          component: SnackbarComponent,
          isError: true,
        });
      },
    });
  }

  onMarkRead(id: string): void {
    this.button.closeMenu();

    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.dataSource = new NotificationDataSourceService(
          this.notificationService
        );
      },
      error: (err) => {
        this.snackbarService.onShowSnackbar({
          message:
            err.error?.errors instanceof Array
              ? err.error?.errors[0].msg
              : err.error?.message,
          component: SnackbarComponent,
          isError: true,
        });
      },
    });
  }

  onDelete(id: string, status: number): void {
    if (status === 1) this.button.closeMenu();

    this.notificationService.delete(id).subscribe({
      next: () => {
        this.dataSource = new NotificationDataSourceService(
          this.notificationService
        );
      },
      error: (err) => {
        this.snackbarService.onShowSnackbar({
          message:
            err.error?.errors instanceof Array
              ? err.error?.errors[0].msg
              : err.error?.message,
          component: SnackbarComponent,
          isError: false,
        });
      },
    });
  }
}
