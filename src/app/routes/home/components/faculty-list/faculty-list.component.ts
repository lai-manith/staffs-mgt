import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Staff } from 'src/app/models/staff';
import { DashboardService } from 'src/app/services/dashboard.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-faculty-list',
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.scss']
})
export class FacultyListComponent {
  displayedColumns: string[] = [
    'ID',
    'name',
    'staff_id',
    'age',
    'gender',
    'position',
    'hire_date',
    'contract_expiry_date',
    '_id'
  ];
  dataSource: MatTableDataSource<Staff> = new MatTableDataSource([]);
  total: number;
  params = {
    page: 1,
    limit: 10,
    search: '',
    status: null,
    gender: null,
    position: null
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;
  images: string[];

  constructor(
    private dashboardService: DashboardService,
    private snackBarService: SnackbarService,
  ) {}

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.setLoading(true);
    this.dashboardService
      .getNearlyExpiredStaff(this.params)
      .pipe(
        map(map => {
          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          }
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
