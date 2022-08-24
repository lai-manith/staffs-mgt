import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Staff } from 'src/app/models/staff';
import { ExcelService } from 'src/app/services/excel.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { MonthPipe } from 'src/app/shares/static-month/pipe/month.pipe';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  index: number;
  urlParam: string;
  staffs: Staff[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private excelService: ExcelService,
    private monthPipe: MonthPipe,
    private staffService: StaffService,
    private snackbarService: SnackbarService
  ) {
    this.urlParam = this.route.snapshot.params.tab;
  }
  ngOnInit(): void {
    switch (this.urlParam) {
      case 'staff-list':
        this.index = 0;
        break;
      case 'staff-active':
        this.index = 1;
        break;
      case 'staff-inactive':
        this.index = 2;
        break;
      default:
        break;
    }
  }

  onIndexChange(event: number) {
    this.index = +event;
    switch (event) {
      case 0:
        this.urlParam = 'staff-list';
        break;
      case 1:
        this.urlParam = 'staff-active';
        break;
      case 2:
        this.urlParam = 'staff-inactive';
        break;
      default:
        break;
    }
    this.router.navigate(['/staff/', `${this.urlParam}`]);
  }

  onGetData(value: Staff[]): void {
    this.staffs = value.map(data => {
      return { ...data };
    });
    this.staffs = this.staffs.map(map => {
      map.date_of_birth = this.customMonth(map.date_of_birth) as any;
      map.hire_date = this.customMonth(map.hire_date) as any;
      map.contract_expiry_date = this.customMonth(map.contract_expiry_date) as any;
      map.create_at = this.customMonth(map.create_at) as any;
      map.update_at = this.customMonth(map.update_at) as any;
      map.position = map.position.title as any;
      map.address = map.address.villages.address as any;
      map.place_of_birth = map.place_of_birth.villages.address as any;
      map.ethnicity = map.ethnicity.nationality as any;
      map.nationality = map.nationality.nationality as any;
      map.stop_working_date = map.stop_working_date ? (this.customMonth(map.stop_working_date) as any) : '';

      delete map._id;
      delete map['__v'];
      delete map.status;
      delete map.month_worked;
      delete map.profile;
      delete map.file_name;
      delete map.attach_files;

      return map;
    });
  }

  exportAll(): void {
    this.staffService
      .getAll({ page: 1, limit: 0 })
      .pipe(
        map(map => {
          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
            data.date_of_birth = this.customMonth(data.date_of_birth) as any;
            data.hire_date = this.customMonth(data.hire_date) as any;
            data.contract_expiry_date = this.customMonth(data.contract_expiry_date) as any;
            data.create_at = this.customMonth(data.create_at) as any;
            data.update_at = this.customMonth(data.update_at) as any;
            data.position = data.position.title as any;
            data.address = data.address.villages.address as any;
            data.place_of_birth = data.place_of_birth.villages.address as any;
            data.ethnicity = data.ethnicity.nationality as any;
            data.nationality = data.nationality.nationality as any;
            data.stop_working_date = data.stop_working_date ? (this.customMonth(data.stop_working_date) as any) : '';

            delete data._id;
            delete data['__v'];
            delete data.status;
            delete data.month_worked;
            delete data.profile;
            delete data.file_name;
            delete data.attach_files;
          }
          return map;
        })
      )
      .subscribe(
        res => {
          this.excelService.exportAsExcelFile(res.list, 'staff-list');
        },
        err =>
          this.snackbarService.onShowSnackbar({
            message: err.message ?? err.error.message,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  export(): void {
    this.excelService.exportAsExcelFile(this.staffs, 'staff-list');
  }

  customMonth(date: Date) {
    return formatDate(new Date(date), 'dd-MM-yyyy', 'en-US');
  }
}
