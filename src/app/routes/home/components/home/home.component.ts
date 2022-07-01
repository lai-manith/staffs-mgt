import { Component, OnInit } from '@angular/core';
import { UserStatusEnum } from 'src/app/models/enums/user-status.enum';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' }
];
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
  }

  userStatusEnum = UserStatusEnum;
  userStatus = UserStatusEnum.active;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  lineChartDataset: number[] = [48, 28, 59, 48, 65, 28, 63, 68, 55, 29];
  lineChartLabel: string[] = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];
  dougnutChartDataset: number[];
  doughnutChartLabels: string[];
  dougnutChartDataTotal: number;

  onGetGender(): void{
    this.dashboardService.getGender()
    .subscribe(
      res => {
        this.dougnutChartDataset = [res.total_male, res.total_female];
        this.doughnutChartLabels = ['Male', 'Female'];
        this.dougnutChartDataTotal = res.total;
      },
      err => {
        this.snackbarService.onShowSnackbar({message: err.error.message ?? err.message, isError: true, component: SnackbarComponent});
      }
    )
  }
}
