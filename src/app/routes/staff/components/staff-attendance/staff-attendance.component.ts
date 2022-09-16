import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs';
import { SearchFilter } from 'src/app/helpers/search-filter-behavior';
import { AttendanceTypeEnum } from 'src/app/models/enums/attendance-type.enum';
import { Filter } from 'src/app/models/filter';
import { Staff } from 'src/app/models/staff';
import { AttendanceResponse, AttendanceType } from 'src/app/models/staff-attendance';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { Pagination } from 'src/app/shares/pagination/pagination';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-staff-attendance',
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['./staff-attendance.component.scss']
})
export class StaffAttendanceComponent extends SearchFilter implements OnInit {
  //*Array Type
  displayedColumns: string[] = ['position', 'date', 'shift', 'status'];
  dataSource: MatTableDataSource<AttendanceResponse> = new MatTableDataSource([]);

  //*Boolean Type

  //*String Type
  id: string = this.route.snapshot.params.id;

  //*Number Type
  total: number = 20;

  //*Date Type
  date: Date = new Date();
  dateString = formatDate(new Date(), 'MM-dd-yyyy', 'en-US');

  //*Object Type
  params: Pagination & {
    date: string;
    staff: string;
    attendance_type?: number;
    shift_type?: number;
  } = {
    limit: 10,
    page: 1,
    date: this.dateString,
    staff: this.id
  };
  staff: Staff;
  totalAttendance: AttendanceType;

  //*ViewChild

  //*FormControl

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService,
    private snackbarService: SnackbarService
  ) {
    super();
  }

  ngOnInit() {
    this.onInitData();
  }

  onInitData(pagination?: Pagination): void {
    this.setLoading(true);
    this.staffService
      .getAttendance({ ...this.params, ...this.filterParams, ...pagination })
      .pipe(
        map(map => {
          for (const element of map.list['attendance']) {
            element.attendance_type = AttendanceTypeEnum[element.attendance_type] as any;
          }
          return map;
        })
      )
      .subscribe(
        res => {
          this.setLoading(false);
          this.staff = res.list['staff'];
          this.totalAttendance = res.list['attendance_total'];
          this.dataSource = new MatTableDataSource(res.list['attendance']);
          this.total = res.total;
        },
        err => {
          this.snackbarService.onShowSnackbar({
            message: err.error?.errors instanceof Array ? err.error?.errors[0].msg : err.error.message,
            component: SnackbarComponent,
            isError: true
          });
        }
      );
  }

  onMonthChange(year: Date): void {
    this.params.date = formatDate(year, 'MM-dd-yyyy', 'en-US');
    this.onInitData();
  }

  loadingTimeout: ReturnType<typeof setTimeout>;
  isLoading: boolean = true;
  private setLoading(isLoading: boolean): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    let delayTime = 300;
    if (!isLoading) {
      delayTime = 0;
    }
    this.loadingTimeout = setTimeout(() => {
      this.isLoading = isLoading;
      this.loadingTimeout = null;
    }, delayTime);
  }
}
