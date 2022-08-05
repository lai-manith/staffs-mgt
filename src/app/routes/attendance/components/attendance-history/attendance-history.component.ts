import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Staff } from 'src/app/models/staff';
import { AttendanceHistory, AttendanceType } from 'src/app/models/staff-attendance';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffAttendanceService } from 'src/app/services/staff-attendance.service';
import { Pagination } from 'src/app/shares/pagination/pagination';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { AttendanceHistoryRecordComponent } from '../attendance-history-record/attendance-history-record.component';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss']
})
export class AttendanceHistoryComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private staffService: StaffAttendanceService,
    private snackbarService: SnackbarService
  ) {}

  //*Array Type
  displayedColumns: string[] = [
    'ID',
    'name',
    'staff_id',
    'gender',
    'position',
    'present',
    'absent',
    'permission',
    'action'
  ];
  dataSource: MatTableDataSource<Staff> = new MatTableDataSource([]);

  //*String Type

  //*Date Type
  date: Date = new Date();
  firstDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  //*Object Type
  params: Pagination & {
    end_date: string;
    start_date: string;
  } = {
    limit: 0,
    page: 1,
    start_date: formatDate(this.firstDate, 'MM-dd-yyyy', 'en-Us'),
    end_date: formatDate(this.lastDate, 'MM-dd-yyyy', 'en-Us')
  };
  attendanceTotal: AttendanceType;

  //*Number
  loadingTimeout: ReturnType<typeof setTimeout>;

  //*Boolean Type
  isLoading: boolean = true;

  //*FormControl
  start_date = new FormControl(this.firstDate);
  end_date = new FormControl(this.lastDate);

  ngOnInit(): void {
    this.onLoad();
  }

  private onLoad(): void {
    this.setLoading(true);
    this.staffService
      .getHistory(this.params)
      .pipe(
        map(map => {
          for (let data of map.staff) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          }
          return map;
        })
      )
      .subscribe({
        next: res => {
          this.setLoading(false);
          this.attendanceTotal = res.attendance_total;
          this.dataSource = new MatTableDataSource(res.staff);
        },
        error: err => {
          this.snackbarService.onShowSnackbar({
            message: err.error?.errors instanceof Array ? err.error?.errors[0].msg : err.error.message,
            component: SnackbarComponent,
            isError: true
          });
        }
      });
  }

  onDateChange(value: Date): void {
    if (value) {
      this.params.start_date = formatDate(this.start_date.value, 'yyyy-MM-dd', 'en-Us');
      this.params.end_date = formatDate(this.end_date.value, 'yyyy-MM-dd', 'en-Us');
      this.onLoad();
    }
  }

  onView(payload: Staff): void {
    const dialogRef = this.dialog.open(AttendanceHistoryRecordComponent, {
      width: '850px',
      data: { payload: payload, param: this.params }
    });
    let instance = dialogRef.componentInstance;
    instance.id = payload._id;
  }

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
