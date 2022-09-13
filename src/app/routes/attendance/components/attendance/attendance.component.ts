import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Attendance, AttendanceCreateModel, AttendanceList } from 'src/app/models/staff-attendance';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffAttendanceService } from 'src/app/services/staff-attendance.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  constructor(
    private attendanceService: StaffAttendanceService,
    @Inject(LOCALE_ID) private locale: string,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.attendantDate = new Date();
    this.attendantDate.setHours(0, 0, 0);
    this.attendanceCreate = {
      date: formatDate(this.attendantDate, 'MM-dd-yyyy', this.locale),
      list: []
    };
    this.displayedColumns = this.shiftColumns.map(c => c.columnDef);
    this.getAttendance();
  }

  trackByIndex = function (i) {
    return i;
  };

  dataSource: any;
  displayedColumns = [];
  shiftColumns = [
    {
      columnDef: 'name',
      shiftType: 0,
      header: 'ឈ្មោះបុគ្គលិក'
    },
    {
      columnDef: 'morning_shift',
      shiftType: 1,
      header: 'វេនព្រឹក'
    },
    {
      columnDef: 'afternoon_shift',
      shiftType: 2,
      header: 'វេនល្ងាច'
    }
  ];

  isCompleted: boolean = true;
  isSaved: boolean = true;
  isCanSave: boolean = false;
  attendance: Attendance[];
  attendantDate: Date;
  attendanceCreate: AttendanceCreateModel;
  filterStartDate: Date;
  filterEndDate: Date;
  isLoading: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  getAttendance() {
    this.isCompleted = false;
    let today = new Date();
    today.setHours(0, 0, 0);
    this.isCanSave = false;

    let tempDate: string;
    tempDate = formatDate(this.attendantDate, 'MM-dd-yyyy', this.locale);
    this.attendanceCreate = {
      date: formatDate(this.attendantDate, 'MM-dd-yyyy', this.locale),
      list: []
    };

    this.isSaved = true;
    this.attendanceService.getAttendance({ date: tempDate, limit: 0 }).subscribe(
      res => {
        this.attendance = res.list;
        if (this.attendantDate <= today) {
          this.isCanSave = true;
        } else {
          this.isCanSave = false;
        }

        if (this.attendance.length > 0) {
          this.attendance.forEach(staff => {
            staff.attendances.forEach(atten => {
              let temp: AttendanceList = {
                staff: staff._id,
                shift_type: atten.shift_type,
                attendance_type: atten.attendance_type
              };
              this.attendanceCreate.list.push(temp);
            });
          });

          let temp = {
            _id: 'all',
            name: '',
            first_name: '',
            last_name: ''
          };
          this.attendance.unshift(temp);
          this.dataSource = new MatTableDataSource(this.attendance);
          this.isCompleted = true;
        }
      },
      err =>
        this.snackbarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        })
    );
  }

  onSubmit() {
    this.isLoading = true;
    const data = {
      date: this.attendanceCreate.date,
      list: this.attendanceCreate.list.filter(e => e.staff != 'all')
    };
    this.attendanceService.createAttendance(data).subscribe(
      res => {
        this.isLoading = false;
        this.snackbarService.onShowSnackbar({
          message: 'add',
          component: SnackbarComponent
        });
        this.getAttendance();
      },
      err =>
        this.snackbarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        })
    );
  }

  dateChange(value: Date) {
    this.attendantDate = value;
    this.getAttendance();
  }

  onPrevDate() {
    this.attendantDate = new Date(this.attendantDate.setDate(this.attendantDate.getDate() - 1));
    this.getAttendance();
  }

  onNextDate() {
    this.attendantDate = new Date(this.attendantDate.setDate(this.attendantDate.getDate() + 1));
    this.getAttendance();
  }

  onAbsentChange(value: number, staffId: string, shiftType: number) {
    this.isSaved = false;
    if (staffId == 'all') {
      let b: boolean = false;
      if (this.attendanceCreate) {
        if (this.attendanceCreate.list) {
          for (let i = 0; i < this.attendanceCreate.list.length; i++) {
            if (
              this.attendanceCreate.list[i].staff == staffId &&
              this.attendanceCreate.list[i].shift_type == shiftType
            ) {
              b = true;
              if (this.attendanceCreate.list[i].attendance_type == value) {
                //Remove all
                this.attendanceCreate.list = this.attendanceCreate.list.filter(e => e.shift_type != shiftType);
                return;
              } else {
                //Update attendance type
                this.attendanceCreate.list[i].attendance_type = value;
              }
              break;
            }
          }
        }

        if (!b) {
          let temp: AttendanceList = {
            staff: staffId,
            shift_type: shiftType,
            attendance_type: value
          };
          this.attendanceCreate.list.push(temp);
        }

        this.attendance.forEach(staff => {
          let t: boolean = false;
          for (let i = 0; i < this.attendanceCreate.list.length; i++) {
            if (
              this.attendanceCreate.list[i].staff == staff._id &&
              this.attendanceCreate.list[i].shift_type == shiftType
            ) {
              t = true;
              this.attendanceCreate.list[i].attendance_type = value;
              break;
            }
          }
          if (!t) {
            //No element in list
            //Push new student to list
            let temp: AttendanceList = {
              staff: staff._id,
              shift_type: shiftType,
              attendance_type: value
            };
            this.attendanceCreate.list.push(temp);
          }
        });
      }
    } else {
      //Remove studentId 'all' from list
      for (let i = 0; i < this.attendanceCreate.list.length; i++) {
        if (this.attendanceCreate.list[i].staff == 'all' && this.attendanceCreate.list[i].shift_type == shiftType) {
          this.attendanceCreate.list.splice(i, 1);
          break;
        }
      }

      let b: boolean = false;
      if (this.attendanceCreate) {
        if (this.attendanceCreate.list) {
          for (let i = 0; i < this.attendanceCreate.list.length; i++) {
            if (
              this.attendanceCreate.list[i].staff == staffId &&
              this.attendanceCreate.list[i].shift_type == shiftType
            ) {
              b = true;
              if (this.attendanceCreate.list[i].attendance_type == value) {
                //Remove
                this.attendanceCreate.list.splice(i, 1);
              } else {
                //Update attendance type
                this.attendanceCreate.list[i].attendance_type = value;
              }
              break;
            }
          }
        }

        if (!b) {
          let temp: AttendanceList = {
            staff: staffId,
            shift_type: shiftType,
            attendance_type: value
          };
          this.attendanceCreate.list.push(temp);
        }
      }
    }
  }

  getAbsentSubject(staffId: string, shiftType: number): string {
    let type: number = 0;
    if (this.attendanceCreate) {
      if (this.attendanceCreate.list.length > 0) {
        for (let i = 0; i < this.attendanceCreate.list.length; i++) {
          if (this.attendanceCreate.list[i].staff == staffId && this.attendanceCreate.list[i].shift_type == shiftType) {
            type = this.attendanceCreate.list[i].attendance_type;
            return type.toString();
          }
        }
      }
    }
    return type.toString();
  }
}
