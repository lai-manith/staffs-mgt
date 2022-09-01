import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, InteractionMode, ChartDataset } from 'chart.js';
import { ReportService } from 'src/app/services/report.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-staff-position-by-year',
  templateUrl: './staff-position-by-year.component.html',
  styleUrls: ['./staff-position-by-year.component.scss']
})
export class StaffPositionByYearComponent implements OnInit {
  constructor(private reportService: ReportService, private snackbarService: SnackbarService) {}

  year: string = new Date().getFullYear().toString();
  maxDate: Date = new Date();

  public legendDisplay = true;
  public chartData: ChartData;
  public chartOptions: ChartOptions = {};
  public tooltipMode: InteractionMode;

  backgroundColor: string[] = ['#ED589D', '#3AACFF'];

  ngOnInit(): void {
    this.onGetGender();
  }

  onGetGender(): void {
    this.reportService.getStaffPosition({ year: this.year }).subscribe(
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
            backgroundColor: ['#ED589D'],
            hoverBackgroundColor: ['#ED589D'],
            barThickness: 16,
            data: data[0]
          },
          {
            label: 'បុគ្គលិកប្រុស',
            backgroundColor: ['#3AACFF'],
            hoverBackgroundColor: ['#3AACFF'],
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

  sumArrays(list: any[]): number[] {
    const sums = list[0].map((x, index: number) => list.reduce((sum, curr) => sum + curr[index], 0));
    return sums;
  }

  onSelectedYear(value): void {
    this.year = new Date(value).getFullYear().toString();
    this.onGetGender();
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
