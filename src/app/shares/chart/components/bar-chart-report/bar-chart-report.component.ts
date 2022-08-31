import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, ChartData, ChartOptions, InteractionMode } from 'chart.js';

@Component({
  selector: 'app-bar-chart-report',
  templateUrl: './bar-chart-report.component.html',
  styleUrls: ['./bar-chart-report.component.scss']
})
export class BarChartReportComponent implements OnInit {
  public type: ChartType = 'bar';
  public data: ChartData;
  public options: ChartOptions;

  @Input() legendDisplay = true;
  @Input() chartData: ChartData;
  @Input() chartOptions: ChartOptions = {};
  @Input() tooltipMode: InteractionMode;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setChart();
  }

  setChart() {
    this.data = this.chartData;
    this.options = {
      responsive: true,

      plugins: {
        legend: {
          display: this.legendDisplay,
          align: 'start',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: {
              family: "'Open Sans', Khmer, 'system ui'"
            },
          }
        },
        tooltip: {
          mode: this.tooltipMode,
          position: 'nearest',
          boxHeight: 4,
          boxWidth: 4,
          boxPadding: 8,
          usePointStyle: true,
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 2,
          bodySpacing: 7,
          bodyFont: {
            family:  "'Open Sans', Khmer, 'system ui'"
          },
          padding: 16,
          titleColor: '#000000',
          titleFont: {
            family:  "'Open Sans', Khmer, 'system ui'"
          },
          backgroundColor: '#ffffff',
          bodyColor: '#000000',
          footerColor: '#000000',
          footerMarginTop: 16,
          footerFont: {
            family:  "'Open Sans', Khmer, 'system ui'"
          },

          callbacks: {
            title: context => {
              if (this.tooltipMode !== 'index') return context[0].label;
              return '';
            },
            labelColor: context => {
              if (this.tooltipMode !== 'index') {
                return {
                  borderColor: '',
                  backgroundColor: ''
                };
              }
              return {
                borderColor: '' + context.dataset.backgroundColor,
                backgroundColor: '' + context.dataset.backgroundColor
              };
            },
            footer: tooltipItems => {
              if (this.tooltipMode !== 'index') return;
              let sum: number = 0;
              let indexAxis: 'x' | 'y' = this.options.indexAxis === 'x' ? 'y' : 'x';

              tooltipItems.forEach(tooltipItem => {
                const obj = tooltipItem.parsed;
                Object.keys(obj).find(() => (sum += obj[indexAxis]));
              });

              return 'សរុប: ' + sum;
            }
          }
        }
      },

      ...this.chartOptions
    };
  }
}
