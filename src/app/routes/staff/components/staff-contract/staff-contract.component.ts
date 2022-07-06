import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ManageContract } from 'src/app/models/contract';
import { Staff } from 'src/app/models/staff';
import { ContractService } from 'src/app/services/contract.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { StaffContractDialogComponent } from '../staff-contract-dialog/staff-contract-dialog.component';
import { StaffSalaryDialogComponent } from '../staff-salary-dialog/staff-salary-dialog.component';

@Component({
  selector: 'app-staff-contract',
  templateUrl: './staff-contract.component.html',
  styleUrls: ['./staff-contract.component.scss']
})
export class StaffContractComponent implements OnInit {

  displayedColumns: string[] = ['ID', 'hire_date', 'current_expired_contract', 'new_expired_contract', 'current_duration', 'duration', 'duration_total', 'createAt', 'action'];
  dataSource: MatTableDataSource<ManageContract> = new MatTableDataSource([]);
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
    private contractService: ContractService,
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
    this.contractService
      .getMany(this.params)
      .pipe(
        map(map => {
          map.list.forEach(element => {
            element.status =
            (element.status === 1 ? { name: 'បន្ដ', name_en: 'active' } : { name: 'មិនបន្ដ', name_en: 'inactive' }) as any;
          });
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

  updateContract(): void {
    const dialogRef = this.dialog
      .open(StaffContractDialogComponent, {
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
          this.contractService.delete(id).subscribe(
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
