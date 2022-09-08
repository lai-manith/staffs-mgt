import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import '../../custom-doughnut.d.ts';
@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {
  constructor() { }
  @Input() dougnutChartDataset: number[] = [0, 0];
  @Input() doughnutChartLabels: string[] = [];
  @Input() dougnutChartDataTotal: number;

  public doughnutChartData: ChartData<'overlappedDoughnut'>;
  public doughnutChartType: ChartType = 'overlappedDoughnut';
  public doughnutOptions: any;

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: this.dougnutChartDataset,
          backgroundColor: ['#ED589D', '#3AACFF']
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
          text: this.dougnutChartDataTotal + 'នាក់',
          color: 'black',
          sidePadding: 20,
          minFontSize: 16,
          maxFontSize: 25,
          lineHeight: 25,
          fontStyle: "'Open Sans', Khmer, 'system ui'"
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
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
          backgroundColor: '#fff',
          titleColor: '#000',
          bodyColor: '#000',
          borderColor: 'rgba(0,0,0,0.09)',
          borderWidth: 3,
          padding: 10,
          bodyFont: {
            family: "'Open Sans', Khmer, 'system ui'"
          },
          titleFont: {
            size: 14,
            family: "'Open Sans', Khmer, 'system ui'"
          },
          footerFont: {
            family: "'Open Sans', Khmer, 'system ui'"
          },
        },
      }
    };
  }
}
