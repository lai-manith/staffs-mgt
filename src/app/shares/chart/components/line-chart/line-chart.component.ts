import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import '../../hovering-line.d.ts';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  @ViewChild('myCanvas') canvas: ElementRef;
  chartLineType: ChartType = 'hoveringLine';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [{ data: [] }],
    labels: []
  };
  lineChartOptions: ChartConfiguration['options'] = {
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
          padding: 20
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        },
        ticks: {
          stepSize: 20,
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
        displayColors: false,
        backgroundColor: '#24292f',
        callbacks: {
          title: function (context): string {
            return context[0].dataset.label;
          },
          label: function (context): string {
            return context.parsed.y + '';
          }
        }
      }
    }
  };
  @Input() lineChartDataset: number[] = [];
  @Input() lineChartLabel: string[] = [];

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

    this.lineChartData = {
      datasets: [
        {
          data: this.lineChartDataset,
          label: 'Students Enrolled',
          backgroundColor: gradientFill,
          borderColor: gradientStroke,
          pointBackgroundColor: 'rgba(255,255,255,1)',
          pointBorderColor: 'hsla(258, 87%, 76%, 1)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          pointBorderWidth: 3,
          pointRadius: 7,
          fill: true,
          tension: 0.4
        }
      ],
      labels: this.lineChartLabel
    };
  }
}
