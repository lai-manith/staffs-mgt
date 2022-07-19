import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Attendance, AttendanceCreateModel, AttendanceList } from 'src/app/models/staff-attendance';
import { StaffAttendanceService } from 'src/app/services/staff-attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  constructor(
    private attendanceService: StaffAttendanceService,
    @Inject(LOCALE_ID) private locale: string,
    private snackBar: MatSnackBar
  ) { }

  onMessage(message: string){
    this.snackBar.open(message, 'បិទ')._dismissAfter(3000);
  }

  ngOnInit(): void {
    this.attendantDate = new Date();
    this.attendantDate.setHours(0,0,0);
    this.attendanceCreate = {
      date: formatDate(this.attendantDate, 'yyyy-MM-dd', this.locale),
      list: []
    }
    this.displayedColumns = this.shiftColumns.map(c => c.columnDef);
    this.getAttendance();
  }

  trackByIndex = function(i) { return i; }

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

  isCompleted: boolean = false;

  isSaved: boolean = true;
  isCanSave: boolean = false;

  attendance: Attendance[];

  classId: string;

  attendantDate: Date;

  inc: number = 0;

  attendanceCreate: AttendanceCreateModel;

  filterStartDate: Date;
  filterEndDate: Date;

  @ViewChild(MatSort) sort: MatSort;

  getAttendance(){
    let today = new Date();
    today.setHours(0,0,0);
    this.isCanSave = false;

    let tempDate: string;
    tempDate = formatDate(this.attendantDate, 'yyyy-MM-dd', this.locale);
    this.attendanceCreate = {
      date: formatDate(this.attendantDate, 'yyyy-MM-dd', this.locale),
      list: []
    };

    this.attendance = [];

    this.isSaved = true;
    this.dataSource = [];
    this.attendanceService.getMany({ date: tempDate }).subscribe(
      (res) => {
        if(res){
          this.attendance = res.list;
          if(this.attendantDate <= today){
            this.isCanSave = true;
          }
          else{
            this.isCanSave = false;
          }

          if(this.attendance.length > 0){
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
            //New .///////
            this.dataSource = new MatTableDataSource(this.attendance);
            ////////
            // this.dataSource.sortingDataAccessor = (item, property) => {
            //   switch(property) {
            //     case 'name': return item.first_name + ' ' + item.last_name;
            //     case 'role': return item.roles.role_name;
            //     default: return item[property];
            //   }
            // };
            // this.dataSource.sort = this.sort;
          }
        }
      },
      (err) => {
        this.onMessage('ការទាញយកវត្តមានបរាជ័យ');
      }
    );
  }

  onSubmit(){
    const data = {
      date: this.attendanceCreate.date,
      list: this.attendanceCreate.list.filter(e => e.staff != 'all')
    };
    this.attendanceService.createAttendance(data).subscribe((res) => {
      if(res){
        this.onMessage('ការរក្សាទុកវត្តមានជោគជ័យ');
        this.isSaved = true;
      }
      else{
        this.onMessage('ការរក្សាទុកវត្តមានបរាជ័យ');
      }
    });
  }

  onAttendanceDateChange(){
    this.getAttendance();
  }

  onPrevDate(){
    this.inc--;
    this.attendantDate.setDate(this.attendantDate.getDate() - 1);
    this.attendantDate = new Date(this.attendantDate.getFullYear(), this.attendantDate.getMonth(), this.attendantDate.getDate());
    this.getAttendance();
  }

  onNextDate(){
    this.inc++;
    this.attendantDate.setDate(this.attendantDate.getDate() + 1);
    this.attendantDate = new Date(this.attendantDate.getFullYear(), this.attendantDate.getMonth(), this.attendantDate.getDate());
    this.getAttendance();
  }

  onAbsentChange(value: number, staffId: string, shiftType: number){
    this.isSaved = false;
    if(staffId == 'all'){
      let b: boolean = false;
      if(this.attendanceCreate){
        if(this.attendanceCreate.list){
          for(let i = 0; i < this.attendanceCreate.list.length; i++){
            if(this.attendanceCreate.list[i].staff == staffId && this.attendanceCreate.list[i].shift_type == shiftType){
              b = true;
              if(this.attendanceCreate.list[i].attendance_type == value){
                //Remove all
                this.attendanceCreate.list = this.attendanceCreate.list.filter(e => e.shift_type != shiftType);
                return;
              }
              else{
                //Update attendance type
                this.attendanceCreate.list[i].attendance_type = value;
              }
              break;
            }
          }
        }
  
        if(!b){
          let temp: AttendanceList = {
            staff: staffId,
            shift_type: shiftType,
            attendance_type: value
          }
          this.attendanceCreate.list.push(temp);
        }

        this.attendance.forEach(staff => {
          let t: boolean = false;
          for(let i = 0; i < this.attendanceCreate.list.length; i++){
            if(this.attendanceCreate.list[i].staff == staff._id && this.attendanceCreate.list[i].shift_type == shiftType){
              t = true;
              this.attendanceCreate.list[i].attendance_type = value;
              break;
            }
          }
          if(!t){
            //No element in list
            //Push new student to list
            let temp: AttendanceList = {
              staff: staff._id,
              shift_type: shiftType,
              attendance_type: value
            }
            this.attendanceCreate.list.push(temp);
          }
        });
      }
    }
    else{
      //Remove studentId 'all' from list
      for(let i = 0; i < this.attendanceCreate.list.length; i++){
        if(this.attendanceCreate.list[i].staff == 'all' && this.attendanceCreate.list[i].shift_type == shiftType){
          this.attendanceCreate.list.splice(i, 1);
          break;
        }
      }

      let b: boolean = false;
      if(this.attendanceCreate){
        if(this.attendanceCreate.list){
          for(let i = 0; i < this.attendanceCreate.list.length; i++){
            if(this.attendanceCreate.list[i].staff == staffId && this.attendanceCreate.list[i].shift_type == shiftType){
              b = true;
              if(this.attendanceCreate.list[i].attendance_type == value){
                //Remove
                this.attendanceCreate.list.splice(i, 1);
              }
              else{
                //Update attendance type
                this.attendanceCreate.list[i].attendance_type = value;
              }
              break;
            }
          }
        }
  
        if(!b){
          let temp: AttendanceList = {
            staff: staffId,
            shift_type: shiftType,
            attendance_type: value
          }
          this.attendanceCreate.list.push(temp);
        }
      }
    }
    
  }

  getAbsentSubject(staffId: string, shiftType: number): string{
    let type: number = 0;
    if(this.attendanceCreate){
      if(this.attendanceCreate.list.length > 0){
        for(let i = 0; i < this.attendanceCreate.list.length; i++){
          if(this.attendanceCreate.list[i].staff == staffId && this.attendanceCreate.list[i].shift_type == shiftType){
            type = this.attendanceCreate.list[i].attendance_type;
            return type.toString();
          }
        }
      }
    }
    return type.toString();
  }

  sortData(sort: Sort): void {
    const data: Array<Attendance> = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
        this.dataSource.data = data;
        return;
    }

    this.dataSource.data = data.sort((a, b) => {
      if(a._id == 'all' || b._id == 'all'){
         return 1
      }
      else{
        let isAsc: boolean = sort.direction === 'asc';
        switch (sort.active) {
            case 'name': return this.compare((a.first_name + ' ' + a.last_name).toLowerCase(), (b.first_name + ' ' + b.last_name).toLowerCase(), isAsc, );
            // case 'column1': return this.compare(a.col1.toLowerCase(), b.col1.toLowerCase(), isAsc);
            //  case 'column2': return this.compare(a.col2.toLowerCase(), b.col2.toLowerCase(), isAsc);
            //   case 'column3': return this.compare(a.col3.toLowerCase(), b.col3.toLowerCase(), isAsc);
            default: return 0;
        }
      }
    });
    this.dataSource = new MatTableDataSource<Attendance>(this.dataSource.data);
  }

  compare(a: any, b: any, isAsc: boolean): number {
    if (a < b) {
        return -1 * (isAsc ? 1 : -1);
    } else if (a > b) {
        return 1 * (isAsc ? 1 : -1);
    } else {
        return 0 * (isAsc ? 1 : -1);
    }
  }
}