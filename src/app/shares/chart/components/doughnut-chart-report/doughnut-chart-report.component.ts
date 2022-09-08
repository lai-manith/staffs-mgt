import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart-report',
  templateUrl: './doughnut-chart-report.component.html',
  styleUrls: ['./doughnut-chart-report.component.scss']
})
export class DoughnutChartReportComponent {
  @Input() dougnutChartDataset: number[];
  @Input() backgroundColor: string[];
  @Input() legendPosition: string = 'bottom';
  @Input() doughnutChartLabels: string[] = ['Male', 'Female'];

  public doughnutChartData: ChartData<'overlappedDoughnut'> = {
    datasets: []
  };
  public doughnutChartType: ChartType = 'overlappedDoughnut';
  public doughnutOptions: any = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dougnutChartDataset.currentValue) {
      this.doughnutChartData = {
        labels: this.doughnutChartLabels,
        datasets: [
          {
            data: this.dougnutChartDataset,
            backgroundColor: this.backgroundColor
          }
        ]
      };

      this.doughnutOptions = {
        cutout: '80%',
        elements: {
          arc: {
            borderWidth: 0,
            borderJoinStyle: 'round'
          },
          center: {
            text: this.dougnutChartDataset?.reduce((a, b) => a + b, 0) + 'នាក់',
            color: '#757575',
            sidePadding: 20,
            minFontSize: 16,
            maxFontSize: 25,
            lineHeight: 25,
            fontStyle: "'Open Sans', Khmer, 'system ui'"
          }
        },
        plugins: {
          legend: {
            position: this.legendPosition,
            labels: {
              font: {
                family: "'Open Sans', Khmer, 'system ui'"
              },
              pointStyle: 'rectRounded',
              usePointStyle: true,
              boxHeight: 30,
              padding: 15
            },
            events: ['mousemove', 'mouseout', 'touchstart', 'touchmove']
          },
          tooltip: {
            enabled: false
          }
        }
      };
    }
  }
}
