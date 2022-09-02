import { Component, ViewChild, ElementRef, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import '../../hovering-line.d.ts';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit {
  stepSize: number = 1;

  chartLineType: ChartType = 'hoveringLine';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [{ data: [] }],
    labels: []
  };
  lineChartOptions: ChartConfiguration['options'] = {};
  gradientFill: any;
  gradientStroke: any;

  @Input() lineChartDataset: number[] = [];
  @Input() lineChartLabel: string[];
  @Input() datasetLabel: string;

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  @ViewChild('myCanvas') canvas: ElementRef;

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    const gradientStroke = ctx.createLinearGradient(100, 0, 500, 0);
    gradientStroke.addColorStop(0, 'hsla(202, 100%, 68%, 0.8)');
    gradientStroke.addColorStop(0.3, 'hsla(227, 100%, 68%, 0.8)');
    gradientStroke.addColorStop(0.6, 'hsla(258, 100%, 68%, 0.8)');
    gradientStroke.addColorStop(1, 'hsla(306, 100%, 68%, 0.8)');

    const gradientFill = ctx.createLinearGradient(100, 0, 500, 0);
    gradientFill.addColorStop(0, 'hsla(202, 100%, 68%, 0.1)');
    gradientFill.addColorStop(0.3, 'hsla(227, 100%, 68%, 0.1)');
    gradientFill.addColorStop(0.6, 'hsla(258, 100%, 68%, 0.1)');
    gradientFill.addColorStop(1, 'hsla(306, 100%, 68%, 0.1)');

    this.lineChartData.datasets[0].borderColor = gradientStroke;
    this.lineChartData.datasets[0].backgroundColor = gradientFill;

    this.gradientFill = gradientFill;
    this.gradientStroke = gradientStroke;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setChart();
  }

  setChart() {
    if (this.lineChartDataset?.length > 0) {
      const max = Math.max(...this.lineChartDataset);
      if (max <= 5) {
        this.stepSize = 1;
      } else if (max <= 10) {
        this.stepSize = 2;
      } else {
        this.stepSize = 5;
      }
    }

    this.lineChartOptions = {
      aspectRatio: 920 / 320,
      interaction: {
        intersect: false,
        mode: 'x'
      },
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            padding: 20,
            font: {
              family: "'Open Sans', Khmer, 'system ui'"
            }
          }
        },
        y: {
          beginAtZero: true,
          suggestedMin: 2,
          suggestedMax: 5,
          grid: {
            drawBorder: false
          },
          ticks: {
            stepSize: this.stepSize,
            padding: 20
          }
        }
      },
      plugins: {
        tooltip: {
          padding: 10,
          xAlign: 'center',
          yAlign: 'bottom',
          titleAlign: 'center',
          bodyAlign: 'center',
          titleFont: {
            size: 13,
            weight: 'normal',
            family: "'Open Sans', Khmer, 'system ui'"
          },
          bodyFont: {
            size: 16,
            weight: 'bold',
            family: "'Open Sans', Khmer, 'system ui'"
          },
          footerFont: {
            family: "'Open Sans', Khmer, 'system ui'"
          },
          displayColors: false,
          backgroundColor: '#24292f',
          callbacks: {
            title: function (context): string {
              return context[0].dataset.label === 'Staffs Absented' ? 'ចំនួនបុគ្គលិកអវត្តមាន' : context[0].dataset.label;
            },
            label: function (context): string {
              return context.parsed.y + '';
            }
          }
        }
      }
    };

    this.lineChartData = {
      datasets: [
        {
          data: this.lineChartDataset,
          label: this.datasetLabel,
          backgroundColor: this.gradientFill,
          borderColor: this.gradientStroke,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderWidth: 2,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.4
        }
      ],
      labels: this.lineChartLabel
    };
  }
}
