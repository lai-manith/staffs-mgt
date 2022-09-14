import { Component, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, InteractionMode } from 'chart.js';
import { ReportService } from 'src/app/services/report.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'src/assets/fonts/vfs_fonts.js';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-staff-gender-by-year',
  templateUrl: './staff-gender-by-year.component.html',
  styleUrls: ['./staff-gender-by-year.component.scss']
})
export class StaffGenderByYearComponent implements OnInit {
  constructor(private reportService: ReportService, private snackbarService: SnackbarService) {}

  dougnutChartDataset: number[];
  doughnutChartLabels: string[];
  dougnutChartDataTotal: number;
  year: string = new Date().getFullYear().toString();
  maxDate: Date = new Date();

  public legendDisplay = true;
  public chartData: ChartData;
  public chartOptions: ChartOptions = {};
  public tooltipMode: InteractionMode;

  backgroundColor: string[] = ['#00C67C', '#DAD873'];

  ngOnInit(): void {
    this.onGetGender();
  }

  onGetGender(): void {
    this.reportService.getStaffAgeGender({ year: this.year }).subscribe(
      res => {
        this.dougnutChartDataset = [res.data.total_female, res.data.total_male];
        this.doughnutChartLabels =
          res.data.total < 1
            ? ['បុគ្គលិកស្រី៖ 0% (0នាក់)', 'បុគ្គលិកប្រុស៖ 0% (0នាក់)']
            : [
                'បុគ្គលិកស្រី៖ ' +
                  ((res.data.total_female / res.data.total) * 100).toFixed(2) +
                  '% (' +
                  res.data.total_female +
                  ' នាក់)',
                'បុគ្គលិកប្រុស៖ ' +
                  ((res.data.total_male / res.data.total) * 100).toFixed(2) +
                  '% (' +
                  res.data.total_male +
                  ' នាក់)'
              ];
        this.dougnutChartDataTotal = res.data.total;

        let labels = [],
          female = [],
          male = [],
          data = [];

        res.report.map((res: any) => {
          labels.push('អាយុ' + res.name);
          female.push(res.female_count);
          male.push(res.male_count);
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

  async onPrint() {
    let docDefinition: any = await this.getDocumentDefinition(); // return document definition

    let fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      Battambang: {
        normal: 'Battambang-Regular.ttf',
        bold: 'Battambang-Bold.ttf',
        italics: 'Battambang-Regular.ttf',
        bolditalics: 'Battambang-Regular.ttf'
      }
    };

    const doughnutTitle = {
      text: 'បុគ្គលិកតាមភេទ',
      color: '#4F9573',
      fontSize: 14
    };
    const doughnutChart = {
      image: await this.getBase64ImageFromURLDoughnutChart(),
      width: 200,
      alignment: 'center'
    };
    docDefinition.content.push(doughnutTitle, doughnutChart);
    pdfMake.createPdf(docDefinition, null, fonts).open();
    // pdfMake.createPdf(docDefinition, null, fonts).download(this.selectedFilter.type.value + '-report.pdf');
  }

  async getDocumentDefinition() {
    (<any>pdfMake).pageLayout = {
      height: 842,
      width: 595,
      margins: Array(4).fill(25)
    };

    return {
      pageSize: 'A4',
      pageMargins: (<any>pdfMake).pageLayout.margins,
      info: {
        title: 'report.pdf'
      },
      content: [
        {
          alignment: 'center',
          columns: [
            {
              image: await this.getBase64ImageFromURL('assets/imgs/logo.png'),
              fit: [45, 46],
              alignment: 'right'
            },
            {
              text: [
                {
                  text: 'ភោជនីយដ្ឋានស្រូវ',
                  fontSize: 18,
                  color: '#4F9573',
                  bold: true,
                  alignment: 'left'
                }
              ],
              margin: [0, 10]
            }
          ],
          columnGap: 10,
          margin: [0, -10, 0, 0]
        },
        '\n',
        {
          columns: [
            {
              text: 'ឆ្នាំ: ' + this.year,
              fontSize: 14
            }
          ]
        },
        '\n',
        {
          text: 'បុគ្គលិកតាមអាយុ',
          color: '#4F9573',
          fontSize: 14
        },
        {
          image: await this.getBase64ImageFromURLChart(),
          width:
            (<any>pdfMake).pageLayout.width -
            (<any>pdfMake).pageLayout.margins[0] -
            (<any>pdfMake).pageLayout.margins[2] // page-width - margin-left - margin-right
        },
        '\n\n'
      ],

      styles: {
        header: {
          font: 'Roboto',
          fontSize: 18,
          bold: true
        },
        bigger: {
          font: 'Roboto',
          fontSize: 14,
          bold: true
        },
        semibold: {
          fontSize: 18,
          bold: true
        }
      },

      // Default style
      defaultStyle: {
        font: 'Battambang',
        fontSize: 10,
        columnGap: 32
      }
    };
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  getBase64ImageFromURLChart() {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      const canvas = document.querySelector('#' + 'number-of-staff' + ' canvas');
      const url = (<any>canvas).toDataURL();

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  getBase64ImageFromURLDoughnutChart() {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      const canvas = document.querySelector('#' + 'number-of-staff-doughnut' + ' canvas');
      const url = (<any>canvas).toDataURL();

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
}
