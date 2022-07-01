import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs';
import { Filter } from 'src/app/models/filter';
import { ManageSalary } from 'src/app/models/salary';
import { Staff } from 'src/app/models/staff';
import { DialogService } from 'src/app/services/dialog.service';
import { PositionService } from 'src/app/services/position.service';
import { SalaryService } from 'src/app/services/salary.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { StaffSalaryDialogComponent } from '../staff-salary-dialog/staff-salary-dialog.component';

@Component({
  selector: 'app-staff-salary',
  templateUrl: './staff-salary.component.html',
  styleUrls: ['./staff-salary.component.scss']
})
export class StaffSalaryComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'name', 'current_salary', 'last_salary', 'createAt', 'status', 'action'];
  dataSource: MatTableDataSource<ManageSalary> = new MatTableDataSource([]);
  total: number;
  params = {
    page: 1,
    limit: 10,
    staff: this.route.snapshot.params.id
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;
  staff: Staff;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private salaryService: SalaryService,
    private dialogService: DialogService,
    private staffService: StaffService
  ) {}

  ngOnInit() {
    this.onLoad();
    this.onLoadStaff();
  }

  onLoadStaff(): void {
    this.staffService
      .getById(this.route.snapshot.params.id)
      .pipe(
        map(data => {
          data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          data.status =
            data.status === true ? { name: 'សកម្ម', name_en: 'active' } : { name: 'អសកម្ម', name_en: 'inactive' };
          return data;
        })
      )
      .subscribe(
        res => {
          this.staff = res;
        },
        err =>
          this.snackBarService.onShowSnackbar({
            message: err.message ?? err,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  onLoad() {
    this.setLoading(true);
    this.salaryService
      .getMany(this.params)
      .pipe(
        map(map => {
          return map;
        })
      )
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource(res.list);
          this.total = res.total;
          this.setLoading(false);
        },
        err =>
          this.snackBarService.onShowSnackbar({
            message: err.message ?? err.error.message,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  goTo(event) {
    this.params.limit = event.limit;
    this.params.page = event.page;
    this.setLoading(false);
    this.onLoad();
  }

  updateSalary(): void {
    const dialogRef = this.dialog
      .open(StaffSalaryDialogComponent, {
        width: '750px',
        data: this.staff
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.onLoad();
          this.onLoadStaff();
        }
      });
  }

  onDelete(id: string) {
    this.dialogService
      .onShowDialog({})
      .afterClosed()
      .subscribe(res => {
        if (res === 'confirm') {
          this.salaryService.delete(id).subscribe(
            res => {
              this.onLoad();
              this.snackBarService.onShowSnackbar({ message: 'delete', component: SnackbarComponent });
            },
            err => {
              this.snackBarService.onShowSnackbar({
                message: err.message ?? err.error.message,
                component: SnackbarComponent,
                isError: true
              });
            }
          );
        }
      });
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
