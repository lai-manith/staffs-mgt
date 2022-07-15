import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SalarySummary } from 'src/app/models/dashboard';
import { UserStatusEnum } from 'src/app/models/enums/user-status.enum';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private loadingService: LoadingService,
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService
  ) {
    this.onGetGender();
    this.getPosition();
    this.onGetSalarySummary();
  }

  userStatusEnum = UserStatusEnum;
  userStatus = UserStatusEnum.active;

  labels: string[];
  datasets: number[];
  indexAxis: 'x' | 'y' = 'x';
  datasetLabel = 'បុគ្គលិក';

  dougnutChartDataset: number[];
  doughnutChartLabels: string[];
  dougnutChartDataTotal: number;

  salarySummary: SalarySummary;

  onGetGender(): void {
    this.dashboardService.getGender().subscribe(
      res => {
        this.dougnutChartDataset = [res.total_male, res.total_female];
        this.doughnutChartLabels = ['ប្រុស', 'ស្រី'];
        this.dougnutChartDataTotal = res.total;
      },
      err => {
        this.snackbarService.onShowSnackbar({
          message: err.error.message,
          isError: true,
          component: SnackbarComponent
        });
      }
    );
  }

  getPosition() {
    this.dashboardService.getStaffByPosition().subscribe(res => {
      const list = res.list;
      let labels = [];
      let datasets = [];
      for (const key in list) {
        labels.push(list[key].name);
        datasets.push(list[key].count);
      }
      this.labels = labels;
      this.datasets = datasets;
    }),
      err => {
        this.snackbarService.onShowSnackbar({
          message: err.error.message,
          isError: true,
          component: SnackbarComponent
        });
      };
  }

  onGetSalarySummary(): void {
    this.dashboardService.getSalarySummary()
    .pipe(map(
      map => {
        map.max_salary = map.max_salary.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }) as any;
        map.min_salary = map.min_salary.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }) as any;
        map.salary_per_month = map.salary_per_month.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }) as any;
        map.salary_per_year = map.salary_per_year.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }) as any;
        return map;
      }
    ))
    .subscribe(
      res => {
        this.salarySummary = res;
      },
      err => {
        this.snackbarService.onShowSnackbar({
          message: err.error.message,
          isError: true,
          component: SnackbarComponent
        });
      }
    );
  }
}
