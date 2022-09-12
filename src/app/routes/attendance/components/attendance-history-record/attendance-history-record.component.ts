import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Params } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { AttendanceTypeEnum } from 'src/app/models/enums/attendance-type.enum';
import { Filter } from 'src/app/models/filter';
import { Staff } from 'src/app/models/staff';
import { AttendanceResponse } from 'src/app/models/staff-attendance';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffAttendanceService } from 'src/app/services/staff-attendance.service';
import { Pagination } from 'src/app/shares/pagination/pagination';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-attendance-history-record',
  templateUrl: './attendance-history-record.component.html',
  styleUrls: ['./attendance-history-record.component.scss']
})
export class AttendanceHistoryRecordComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      payload: Staff;
      param: Pagination & { start_date: string; end_date?: string };
    },
    private staffService: StaffAttendanceService,
    private snackbarService: SnackbarService
  ) {}

  //*Array Type
  displayedColumns: string[] = ['position', 'date', 'shift', 'status'];
  dataSource: MatTableDataSource<AttendanceResponse> = new MatTableDataSource([]);
  filters: Filter[] = [
    {
      data: [
        {
          label: 'ទាំងអស់',
          value: null
        },
        {
          label: 'មក',
          value: 1
        },
        {
          label: 'អត់ច្បាប់',
          value: 2
        },
        {
          label: 'មានច្បាប់',
          value: 3
        }
      ],
      selectedIndex: 0,
      labelFunc: 'ប្រភេទវត្តមាន',
      paramKey: 'attendance_type',
      matIcon: 'person_search'
    },
    {
      data: [
        {
          label: 'ទាំងអស់',
          value: null
        },
        {
          label: 'ព្រឹក',
          value: 1
        },
        {
          label: 'ល្ងាច',
          value: 2
        }
      ],
      selectedIndex: 0,
      labelFunc: 'វេន',
      paramKey: 'shift_type',
      matIcon: 'light_mode'
    }
  ];

  //*Boolean Type

  //*String Type
  id: string;

  //*Number Type
  total: number = 20;

  //*Date Type
  date: Date = new Date();

  //*Object Type
  params: Pagination & {
    start_date: string;
    end_date: string;
    staff: string;
    attendance_type?: number;
    shift_type?: number;
  } = {
    limit: 10,
    page: 1,
    start_date: this.data.param.start_date,
    end_date: this.data.param.end_date,
    staff: this.data.payload._id
  };

  //*ViewChild
  @ViewChild(MatSort) sort: MatSort;

  //*FormControl

  ngOnInit(): void {
    this.onSetActiveFilter();
    this.onLoad();
  }

  onLoad() {
    this.setLoading(true);
    this.staffService
      .getHistoryRecord(this.params)
      .pipe(
        map(map => {
          for (const element of map.list) {
            element.attendance_type = AttendanceTypeEnum[element.attendance_type] as any;
          }
          return map;
        })
      )
      .subscribe(
        res => {
          this.setLoading(false);
          this.dataSource = new MatTableDataSource(res.list);
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

  goTo(event: Pagination) {
    this.params.limit = event.limit;
    this.params.page = event.page;
    this.onLoad();
  }

  setParams(paramObj: Params): void {
    this.params.page = 1;
    this.params = { ...this.params, ...paramObj };
    if (Object.entries(paramObj).length < 1) {
      this.onSetActiveFilter();
      delete this.params.shift_type;
      delete this.params.attendance_type;
    }
    this.onLoad();
  }

  onSetActiveFilter() {
    this.filters.forEach((element, i) => {
      this.filters[i].selectedValue = this.filters[i].data[0];
    });
  }
}
