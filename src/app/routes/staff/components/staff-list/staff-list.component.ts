import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Staff } from 'src/app/models/staff';
import { ExcelService } from 'src/app/services/excel.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { MonthPipe } from 'src/app/shares/static-month/pipe/month.pipe';

import * as pdfMake from '../../../../../../node_modules/pdfmake/build/pdfmake.js';
import * as pdfFonts from 'src/assets/fonts/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  index: number;
  urlParam: string;
  staffs: Staff[];
  dataRender: Staff[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private excelService: ExcelService,
    private monthPipe: MonthPipe,
    private staffService: StaffService,
    private snackbarService: SnackbarService
  ) {
    this.urlParam = this.route.snapshot.params.tab;
  }
  ngOnInit(): void {
    switch (this.urlParam) {
      case 'staff-list':
        this.index = 0;
        break;
      case 'staff-active':
        this.index = 1;
        break;
      case 'staff-inactive':
        this.index = 2;
        break;
      default:
        break;
    }
  }

  onIndexChange(event: number) {
    this.index = +event;
    switch (event) {
      case 0:
        this.urlParam = 'staff-list';
        break;
      case 1:
        this.urlParam = 'staff-active';
        break;
      case 2:
        this.urlParam = 'staff-inactive';
        break;
      default:
        break;
    }
    this.router.navigate(['/staff/', `${this.urlParam}`]);
  }

  onGetData(value: Staff[]): void {
    this.dataRender = value.map(data => {
      return { ...data };
    });
    this.staffs = value.map(data => {
      return { ...data };
    });
    this.staffs = this.staffs.map(map => {
      map.date_of_birth = this.customMonth(map.date_of_birth) as any;
      map.hire_date = this.customMonth(map.hire_date) as any;
      map.contract_expiry_date = this.customMonth(map.contract_expiry_date) as any;
      map.create_at = this.customMonth(map.create_at) as any;
      map.update_at = this.customMonth(map.update_at) as any;
      map.position = map.position.title as any;
      map.address = map.address.villages.address as any;
      map.place_of_birth = map.place_of_birth.villages.address as any;
      map.ethnicity = map.ethnicity.nationality as any;
      map.nationality = map.nationality.nationality as any;
      map.stop_working_date = map.stop_working_date ? (this.customMonth(map.stop_working_date) as any) : '';

      delete map._id;
      delete map['__v'];
      delete map.status;
      delete map.month_worked;
      delete map.profile;
      delete map.file_name;
      delete map.attach_files;

      if (this.index === 1) delete map.stop_working_date;

      return map;
    });
  }

  exportAll(status: number): void {
    this.staffService
      .getAll({ page: 1, limit: 0, status: this.index === 0 ? null : this.index === 2 ? false : true })
      .pipe(
        map(map => {
          this.dataRender = map.list.map(data => {
            return { ...data };
          });

          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
            data.status =
              data.status === true ? { name: 'សកម្ម', name_en: 'active' } : { name: 'អសកម្ម', name_en: 'inactive' };

            data.date_of_birth = this.customMonth(data.date_of_birth) as any;
            data.hire_date = this.customMonth(data.hire_date) as any;
            data.contract_expiry_date = this.customMonth(data.contract_expiry_date) as any;
            data.create_at = this.customMonth(data.create_at) as any;
            data.update_at = this.customMonth(data.update_at) as any;
            data.position = data.position.title as any;
            data.address = data.address.villages.address as any;
            data.place_of_birth = data.place_of_birth.villages.address as any;
            data.ethnicity = data.ethnicity.nationality as any;
            data.nationality = data.nationality.nationality as any;
            data.stop_working_date = data.stop_working_date ? (this.customMonth(data.stop_working_date) as any) : '';

            delete data._id;
            delete data['__v'];
            delete data.month_worked;
            delete data.profile;
            delete data.file_name;
            delete data.status;
            delete data.attach_files;

            if (this.index === 1) delete data.stop_working_date;
          }
          return map;
        })
      )
      .subscribe(
        res => {
          if (status === 1) this.onPrint();
          else this.excelService.exportAsExcelFile(res.list, 'staff-list');
        },
        err =>
          this.snackbarService.onShowSnackbar({
            message: err.message ?? err.error.message,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  khmerMonth(date: Date): string {
    let newDate = new Date(date);
    return (
      formatDate(newDate, 'dd', 'en-US') +
      '-' +
      this.monthPipe.transform(newDate.getMonth().toString()) +
      '-' +
      newDate.getFullYear()
    );
  }

  export(status: number): void {
    if (status === 1) this.onPrint();
    else this.excelService.exportAsExcelFile(this.staffs, 'staff-list');
  }

  customMonth(date: Date) {
    return formatDate(new Date(date), 'dd-MM-yyyy', 'en-US');
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

  mapTableBody(data: Staff[]): Array<Array<string>> {
    let tbData: any[];
    tbData = [['លេខរៀង', 'ឈ្មោះ', 'អត្តលេខ', 'អាយុ', 'ភេទ', 'តំណែង', 'ថ្ងៃចូលធ្វើការ', 'ថ្ងៃផុតកុងត្រា', 'ស្ថានភាព']];
    for (let i: number = 0; i < data.length; i++) {
      if (data[i].gender === 'male' || data[i].gender === 'female') {
        data[i].gender = data[i].gender === 'male' ? 'ប្រុស' : 'ស្រី';
      }

      if (!data[i].status?.name) {
        data[i].status =
          data[i].status === true ? { name: 'សកម្ម', name_en: 'active' } : { name: 'អសកម្ម', name_en: 'inactive' };
      }

      const tempRow = [];
      tempRow.push(i + 1);
      tempRow.push(data[i].first_name + ' ' + data[i].last_name);
      tempRow.push(data[i].id_card);
      tempRow.push(data[i].age);
      tempRow.push(data[i].gender);
      tempRow.push(data[i].position.title);
      tempRow.push(this.khmerMonth(data[i].hire_date));
      tempRow.push(this.khmerMonth(data[i].contract_expiry_date));
      tempRow.push(data[i].status?.name);
      tbData.push(tempRow);
    }
    return tbData;
  }

  async onPrint() {
    const cWidths = [];
    cWidths.push('auto');
    cWidths.push('*');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');

    let dataBody = this.mapTableBody(this.dataRender);
    let styledData = dataBody.map((rowValue, rIndex) =>
      dataBody[rIndex].map((columnValue, cIndex) => {
        //Sample Data to return
        let dataReturn = {
          text: '',
          color: '#424242',
          margin: [10, 5, 10, 5],
          alignment: 'left',
          fillColor: ''
        };

        if (rIndex === 0) {
          dataReturn.text = columnValue;
          dataReturn.color = '#000';
          dataReturn.fillColor = '#D3E4DD';
          return dataReturn;
        } else if (cIndex === 0) {
          dataReturn.text = columnValue;
          dataReturn.color = '#237a57';
          if (rIndex % 2 === 0) {
            dataReturn.fillColor = '#e8f1ee';
            return dataReturn;
          } else {
            return dataReturn;
          }
        }

        if (rIndex % 2 === 0) {
          dataReturn.text = columnValue;
          dataReturn.fillColor = '#e8f1ee';
          return dataReturn;
        } else {
          dataReturn.text = columnValue;
          return dataReturn;
        }
      })
    );

    let pdfTitle: string = 'តារាងបុគ្គលិក';

    const DATA = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
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
        {
          text: pdfTitle,
          style: 'sectionHeader'
        },
        {
          style: 'tableGrading',
          table: {
            widths: cWidths,
            headerRows: 1,
            body: styledData
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            }
          }
        }
      ],
      defaultStyle: {
        font: 'Battambang',
        fontSize: 11
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 25]
        },
        subheader: {
          fontSize: 16,
          bold: true
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white'
        },
        alignCenter: {
          alignment: 'center'
        },
        ml15: {
          margin: [-15, 0, 0, 0]
        },
        tableGrading: {
          color: '#424242'
        },
        sectionHeader: {
          decoration: 'underline',
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 10]
        },
        active: {
          color: '#13A200'
        },
        inactive: {
          color: '#F44336'
        }
      }
    };
    pdfMake.fonts = {
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

    pdfMake.createPdf(DATA).print();
  }
}
