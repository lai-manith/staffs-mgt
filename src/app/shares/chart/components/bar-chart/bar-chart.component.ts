import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  type: ChartType = 'bar';
  data: ChartConfiguration['data'] = {
    datasets: [{ data: [] }],
    labels: [],
  };
  options: ChartConfiguration['options'] = {};

  @Input() labels: string[];
  @Input() datasets: number[];
  @Input() indexAxis: "x" | "y" = "x";
  @Input() datasetLabel = '';
  @Input() legend: boolean;

  constructor() { }

  ngOnInit(): void {
    this.setChart();
  }

  ngOnChanges() {
    this.setChart();
  }

  setChart() {

    let stepSize = 1;
    // calc step size
    if (this.datasets) {
      const max = Math.max(...this.datasets);
      if (max <= 5) {
        stepSize = 1;
      } else if (max <= 10) {
        stepSize = 2;
      } else {
        stepSize = 5;
      }
    }

    let otherOption = {};

    // chart option
    if (this.indexAxis === "y") {

      otherOption = {
        backgroundColor: [
          '#FF9D55',
          '#AD5389',
          '#A3A1FB',
          '#FF5D5D',
          '#55D8FC',
          '#FFDA83',
          '#32A4AC',
          '#302B63'
        ],
        barThickness: 25,
        borderRadius: 4
      };

      // vertical bar
      this.options = {
        indexAxis: this.indexAxis,
        scales: {
          x: {
            suggestedMin: 2,
            suggestedMax: 5,
            grid: {
              tickColor: '#fff'
            },
            ticks: {
              stepSize: stepSize
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },

      }
    } else {

      otherOption = {
        backgroundColor: '#504f95',
        barThickness: 16,
        borderRadius: 8
      };

      // horizontal bar
      this.options = {
        indexAxis: this.indexAxis,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: "'Open Sans', Khmer, 'system ui'"
              }
            }
          },
          y: {
            suggestedMin: 2,
            suggestedMax: 5,
            grid: {
              tickColor: '#fff'
            },
            ticks: {
              stepSize: stepSize
            }
          }
        }
      }
    }

    this.options.plugins = {
      legend: {
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
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'rgba(0,0,0,0.09)',
        borderWidth: 3,
        padding: 10,
        displayColors: false,
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
    };

    // chart config
    this.data = {
      labels: this.labels,
      datasets: [{
        label: this.datasetLabel,
        data: this.datasets,
        ...otherOption
      }]
    };
  }

}
