import { Component } from '@angular/core';
import { ChartData, ChartOptions, InteractionMode, ChartDataset } from 'chart.js';
import moment from 'moment';
import { map } from 'rxjs';
import { SalarySummary } from 'src/app/models/dashboard';
import { UserStatusEnum } from 'src/app/models/enums/user-status.enum';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { MonthPipe } from 'src/app/shares/static-month/pipe/month.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService,
    private khmerMonth: MonthPipe
  ) {
    this.onGetGender();
    this.onGetStaffPosition();
    this.onGetSalarySummary();
  }

  userStatusEnum = UserStatusEnum;
  userStatus = UserStatusEnum.active;

  dougnutChartDataset: number[];
  doughnutChartLabels: string[];
  dougnutChartDataTotal: number;

  lineChartDataset: number[];
  lineChartLabel: string[];
  staffChartDataset: number[];

  salarySummary: SalarySummary;

  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(
    new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).setMonth(new Date().getMonth() + 1)
  );

  onGetGender(): void {
    this.dashboardService.getGender().subscribe(
      res => {
        this.dougnutChartDataset = [res.total_male, res.total_female];
        this.doughnutChartLabels = ['បុគ្គលិកប្រុស', 'បុគ្គលិកស្រី'];
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

  onGetSalarySummary(): void {
    this.dashboardService
      .getSalarySummary()
      .pipe(
        map(map => {
          // map.max_salary = map.max_salary.toLocaleString('en-US', {
          //   style: 'currency',
          //   currency: 'USD'
          // }) as any;
          // map.min_salary = map.min_salary.toLocaleString('en-US', {
          //   style: 'currency',
          //   currency: 'USD'
          // }) as any;
          // map.max_age = map.max_age;
          // map.min_age = map.min_age;
          return map;
        })
      )
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

  public legendDisplay = true;
  public chartData: ChartData;
  public chartOptions: ChartOptions = {};
  public tooltipMode: InteractionMode;

  backgroundColor: string[] = ['#00C67C', '#DAD873'];

  ngOnInit(): void {
    this.onGetGender();
    this.getStaffAttendance();
  }

  onGetStaffPosition(): void {
    this.dashboardService.getStaffByPosition().subscribe(
      res => {
        let labels = [],
          female = [],
          male = [],
          data = [];

        res.list.map((res: any) => {
          labels.push(res.name);
          female.push(res.total_female);
          male.push(res.total_male);
        });
        data.push(female, male);

        const datasets: ChartDataset[] = [
          {
            label: 'បុគ្គលិកស្រី',
            backgroundColor: this.backgroundColor[0],
            hoverBackgroundColor: this.backgroundColor[0],
            barThickness: 16,
            data: data[0]
          },
          {
            label: 'បុគ្គលិកប្រុស',
            backgroundColor: this.backgroundColor[1],
            hoverBackgroundColor: this.backgroundColor[1],
            barThickness: 16,
            data: data[1]
          }
        ];

        const summaryList = this.sumArrays(data);
        let maxTarget = 0;

        if (summaryList?.length > 0) {
          maxTarget = this.calcMaxTarget(summaryList);
        }

        const options: ChartOptions = {
          indexAxis: 'y',
          scales: {
            // configured into stacked bar charts by changing the settings on the X and Y axes to enable stacking
            x: {
              stacked: true,
              grid: {
                borderDash: [5]
              },
              ticks: {
                stepSize: maxTarget / 5
              },
              min: 0,
              max: maxTarget
            },
            y: {
              stacked: true,
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: "'Open Sans', Khmer, 'system ui'"
                }
              }
            }
          }
        };

        this.config(labels, datasets, options, true, 'index');
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

  getStaffAttendance(): void {
    this.dashboardService.getStaffAttendance().subscribe(res => {
      this.lineChartLabel = res.list.map(
        l => moment(l._id).format('DD') + ' ' + this.khmerMonth.transform((new Date(l._id).getMonth() + 1).toString())
      );
      this.staffChartDataset = res.list.map(l => l.count);
    });
  }

  sumArrays(list: any[]): number[] {
    const sums = list[0].map((x, index: number) => list.reduce((sum, curr) => sum + curr[index], 0));
    return sums;
  }

  calcMaxTarget(list: number[]): number {
    let maxTarget = 0;
    const maxNumber = Math.max(...list);
    if (maxNumber == 0) {
      return 10;
    }
    while (maxNumber > maxTarget) {
      if (maxTarget < 50) {
        maxTarget += 10;
      } else if (maxTarget < 500) {
        maxTarget += 50;
      } else if (maxTarget < 5000) {
        maxTarget += 500;
      } else {
        maxTarget += 1000;
      }
    }
    return maxTarget;
  }

  config(
    labels: string[],
    datasets: ChartDataset[],
    options: ChartOptions,
    legend?: boolean,
    mode: InteractionMode = 'nearest'
  ) {
    this.chartData = {
      labels: labels,
      datasets: datasets
    };
    this.chartOptions = options;
    this.legendDisplay = legend;
    this.tooltipMode = mode;
  }
}
