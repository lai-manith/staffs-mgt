import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Staff } from 'src/app/models/staff';
import { ExcelService } from 'src/app/services/excel.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { MonthPipe } from 'src/app/shares/static-month/pipe/month.pipe';
import * as XLSX from 'xlsx';

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

      return map;
    });
  }

  exportAll(): void {
    this.staffService
      .getAll({ page: 1, limit: 0, status: this.index === 0 ? null : this.index === 2 ? false : true })
      .pipe(
        map(map => {
          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
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
            delete data.status;
            delete data.month_worked;
            delete data.profile;
            delete data.file_name;
            delete data.attach_files;
          }
          return map;
        })
      )
      .subscribe(
        res => {
          this.excelService.exportAsExcelFile(res.list, 'staff-list');
        },
        err =>
          this.snackbarService.onShowSnackbar({
            message: err.message ?? err.error.message,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  export(): void {
    this.onPrint();
    //this.excelService.exportAsExcelFile(this.staffs, 'staff-list');
  }

  customMonth(date: Date) {
    return formatDate(new Date(date), 'dd-MM-yyyy', 'en-US');
  }


  mapTableBody(data: any[]): Array<Array<string>> {
    let tbData: any[];
    tbData = [['លេខរៀង', 'ឈ្មោះ', 'ភេទ', 'ពិន្ទុចុងឆ្នាំ', 'អវត្តមានសរុប', 'លទ្ធផលចុងឆ្នាំ']];
    for (let i: number = 0; i < data.length; i++) {
      const tempRow = [];
      tempRow.push(i + 1);
      tempRow.push(data[i].name);
      tempRow.push(data[i].gender);
      tempRow.push(data[i].year_average);
      tempRow.push(data[i].attendances);
      tempRow.push(data[i].pass_fail);

      tbData.push(tempRow);
    }
    return tbData;
  }

  onPrint() {
    const cWidths = [];
    cWidths.push('auto');
    cWidths.push('*');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');
    cWidths.push('auto');

    let dataRender = this.staffs;

    let dataBody = this.mapTableBody(dataRender);
    let styledData = dataBody.map((rowValue, rIndex) =>
      dataBody[rIndex].map((columnValue, cIndex) => {

        //Sample Data to return
        let dataReturn = {
          text: '',
          color: '#424242',
          margin: [10, 5, 10, 5],
          alignment: 'center',
          fillColor: ''
        };

        if (rIndex === 0) {
          dataReturn.text = columnValue;
          dataReturn.color = '#000';
          dataReturn.fillColor = '#D3E4DD';
          return dataReturn;
        }
        else if (cIndex === 0) {
          dataReturn.text = columnValue;
          dataReturn.color = '#237a57';
          if (rIndex % 2 === 0) {
            dataReturn.fillColor = '#e8f1ee';
            return dataReturn;
          }
          else {
            return dataReturn;
          }
        }

        if (rIndex % 2 === 0) {
          if (+columnValue === 1) {
            dataReturn.color = '#13A200';
            dataReturn.text = 'ជាប់';
            dataReturn.fillColor = '#e8f1ee';
            return dataReturn;
          }
          else if (+columnValue === -1) {
            dataReturn.text = 'ធ្លាក់';
            dataReturn.color = '#F44336';
            dataReturn.fillColor = '#e8f1ee';
            return dataReturn;
          }
          else {
            dataReturn.text = columnValue;
            dataReturn.fillColor = '#e8f1ee';
            return dataReturn;
          }
        }
        else {
          if (+columnValue === -1) {
            dataReturn.text = 'ធ្លាក់';
            dataReturn.color = '#F44336';
            return dataReturn;
          }
          else if (+columnValue === 1) {
            dataReturn.color = '#13A200';
            dataReturn.text = 'ជាប់';
            return dataReturn;
          }
          else {
            dataReturn.text = columnValue;
            return dataReturn;
          }
        }
      })
    );

    let pdfTitle: string = "ព័ត៌មានថ្នាក់ និងចំនួនសិស្ស";
    let classHeader: string = "ព័ត៌មានទូទៅក្នុងថ្នាក់";
    let dataHeader = {
      academicYear: 2022,
      grade: 'test',
      name: 'test',
      classroom: 'test',
      homeroomTeacher: 'test',
      status: 1 === 1 ? { name: "សកម្ម", name_en: "active" } : { name: "អសកម្ម", name_en: "inactive" }
    }
    let tableHeader: string = "តារាងឈ្មោះសិស្សក្នុងថ្នាក់"

    const DATA = {
      pageSize: 'A4',
      content: [
        {
          text: pdfTitle, style: ['header', 'alignCenter']
        },
        {
          text: classHeader,
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              { text: `ឆ្នាំសិក្សា: ${dataHeader.academicYear}` },
              { text: `ថ្នាក់: ${dataHeader.grade}` },
              { text: `ឈ្មោះ:  ${dataHeader.name}` },
              { text: `ថ្នាក់រៀន: ${dataHeader.classroom}` },
            ],
            [
              {
                text: `គ្រូបន្ទុកថ្នាក់: ${dataHeader.homeroomTeacher}`,
                alignment: 'right'
              },
              {
                text: `វេនសិក្សាបច្ចុប្បន្ន:  —/—`,
                alignment: 'right'
              },
              {
                alignment: 'right',
                text: [
                  {
                    text: 'ស្ថានភាព:  '
                  },
                  {
                    style: dataHeader.status.name_en,
                    text: dataHeader.status.name,
                  }
                ]
              }
            ]
          ]
        },
        {
          text: '\n'
        },
        {
          text: tableHeader,
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
            },
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
          bold: true,
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
          color: '#424242',
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
