import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CityProvinces, Districts, Communes, Villages, Address } from 'src/app/models/address';
import { Staff } from 'src/app/models/staff';
import { AddressService } from 'src/app/services/address.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

import * as pdfMake from '../../../../../../node_modules/pdfmake/build/pdfmake.js';
import * as pdfFonts from 'src/assets/fonts/vfs_fonts';
import { map } from 'rxjs';
import { StaticFilePipe } from 'src/app/shares/static-file/pipes/static-file.pipe';
import { DurationPipe } from 'src/app/shares/static-month/pipe/duration.pipe';
import { MonthPipe } from 'src/app/shares/static-month/pipe/month.pipe';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-staff-editing',
  templateUrl: './staff-editing.component.html',
  styleUrls: ['./staff-editing.component.scss']
})
export class StaffEditingComponent implements OnInit {
  imgDefault = 'assets/imgs/profile-default.svg';
  imgActive: string = 'https://res.cloudinary.com/dxrkctl9c/image/upload/v1639121305/image/password-animate_kl148c.svg';
  staff: Staff;
  _id: string = this.route.snapshot.params.id;
  isActive: boolean = null;
  static imgBase64: string;

  constructor(
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialogService: DialogService,
    private snackBarService: SnackbarService,
    private readonly staffService: StaffService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private staticFilePipe: StaticFilePipe,
    private durationPipe: DurationPipe,
    private monthPipe: MonthPipe
  ) { }

  ngOnInit(): void {
    this.onLoad();
  }

  onConvertImgToBase64(): void {
    if (this.staff.profile) {
      this.dataURI(this.staticFilePipe.transform(this.staff.profile), function (dataUrl) {
        StaffEditingComponent.imgBase64 = dataUrl;
      });
    } else {
      this.getBase64Image('assets/imgs/profile-default.png')
        .then(result => {
          StaffEditingComponent.imgBase64 = result as string
        })
        .catch(err => console.error(err));
    }
  }

  onLoad() {
    this.staffService
      .getById(this.route.snapshot.params.id)
      .pipe(
        map(data => {
          this.isActive = data.status;
          data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          data.salary = data.salary.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          }) as any;
          data.status =
            data.status === true ? { name: 'សកម្ម', name_en: 'active' } : { name: 'អសកម្ម', name_en: 'inactive' };
          return data;
        })
      )
      .subscribe(
        res => {
          this.staff = res;
          this.onConvertImgToBase64();
        },
        err =>
          this.snackBarService.onShowSnackbar({
            message: err.message ?? err,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  formatContactDuration(value: string): string {
    for (let i = 0; i < value.length; i++) {
      console.log(value[i]);
    }
    return value;
  }

  onDelete() {
    this.dialogService
      .onShowDialog({})
      .afterClosed()
      .subscribe(res => {
        if (res === 'confirm') {
          this.staffService.delete(this._id).subscribe(
            res => {
              this.router.navigate(['../../'], { relativeTo: this.route });
              this.snackBarService.onShowSnackbar({
                message: 'delete',
                component: SnackbarComponent
              });
            },
            err => {
              this.snackBarService.onShowSnackbar({
                message: err.message ?? err.error.message,
                component: SnackbarComponent,
                isError: true
              });
            }
          );
        }
      });
  }

  accountStatus: boolean;
  onSetStatusAccount(status) {
    this.dialogService
      .onShowDialog({
        title: 'បញ្ឈប់បុគ្គលិក',
        message: 'តើអ្នកពិតជាចង់បញ្ឈប់បុគ្គលិកនេះមែនទេ?',
        icon: 'assets/icons/warning.svg'
      })
      .afterClosed()
      .subscribe(res => {
        if (res === 'confirm') {
          this.onConfirmStatusSubmit(status);
        }
      });
  }

  onConfirmStatusSubmit(status: boolean) {
    this.staffService.setStatus(this._id).subscribe(
      res => {
        let message = this.isActive ? 'គណនីត្រូវបានបិទជាបណ្ដោះអាសន្ន' : 'គណនីត្រូវបានបើកជាបណ្ដោះអាសន្ន';
        this.snackBarService.onShowSnackbar({
          message: message,
          component: SnackbarComponent
        });
        this.dialog.closeAll();
        this.onLoad();
      },
      err => {
        let message = err.error.message ?? err.message;
        if (err.errors.message === 'Invalid Password') message = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
        this.snackBarService.onShowSnackbar({
          message: message,
          component: SnackbarComponent,
          isError: true
        });
      }
    );
  }

  async getBase64Image(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  dataURI(url, callback) {
    let xhRequest = new XMLHttpRequest();
    xhRequest.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhRequest.response);
    };
    xhRequest.open('GET', url);
    xhRequest.responseType = 'blob';
    xhRequest.send();
  }

  khmerMonth(date: Date) {
    const newDate =
      new Date(date).getDay() +
      ' ' +
      this.monthPipe.transform(new Date(date).getMonth().toString()) +
      ' ' +
      new Date(date).getFullYear();
    return newDate;
  }

  onPrint() {
    let pdfTitle: string = 'ប្រវត្តិរូបសង្ខេប';
    const DATA = {
      pageSize: 'A4',
      content: [
        {
          text: pdfTitle,
          style: ['header', 'alignCenter', 'color'],
        },
        {
          image: StaffEditingComponent.imgBase64,
          absolutePosition: { x: 470, y: 35 }
        },

        {
          text: (this.staff.first_name + ' ' + this.staff.last_name).toUpperCase(),
          style: ['sectionHeader', 'color']
        },
        {
          columns: [
            [{ text: 'ទីកន្លែងបច្ចុប្បន្ន' }, { text: 'លេខទូរស័ព្ទ' }, { text: 'អុីម៊ែល' }],
            [
              { text: ':  ' + this.staff.address.villages.address, margin: [-150, 0, 0, 0] },
              {
                text: ':  ' + this.staff.phone,
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + (this.staff.email || ''),
                margin: [-150, 0, 0, 0]
              }
            ]
          ]
        },

        {
          text: '\n'
        },

        {
          text: '1. ព័ត៌មានផ្ទាល់ខ្លួន',
          style: ['sectionHeader', 'color', 'border']
        },
        {
          columns: [
            [
              { text: 'ភេទ' },
              { text: 'អាយុ' },
              { text: 'ថ្ងៃកំណើត' },
              { text: 'ទីកន្លែងកំណើត' },
              { text: 'សញ្ជាតិ' },
              { text: 'ជនជាតិ' }
            ],
            [
              { text: ':  ' + this.staff.gender, margin: [-150, 0, 0, 0] },
              { text: ':  ' + this.staff.age + 'ឆ្នាំ', margin: [-150, 0, 0, 0] },
              {
                text: ':  ' + this.khmerMonth(this.staff.date_of_birth),
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.place_of_birth.villages.address,
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.nationality.nationality,
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.ethnicity.nationality,
                margin: [-150, 0, 0, 0]
              }
            ]
          ]
        },

        {
          text: '\n'
        },

        {
          text: '2. ព័ត៌មានក្នុងក្រុមហ៊ុន',
          style: ['sectionHeader', 'color', 'border']
        },
        {
          columns: [
            [
              { text: 'លេខសម្គាល់បុគ្គលិក' },
              { text: 'តួនាទី' },
              { text: 'ប្រាក់ខែ' },
              { text: 'ថ្ងៃចូលធ្វើការ' },
              { text: 'ថ្ងៃផុតកុងត្រា' },
              { text: 'រយៈពេលផុតកុងត្រា' },
              { text: 'ស្ថានភាព' }
            ],
            [
              { text: ':  ' + this.staff.staff_id, margin: [-150, 0, 0, 0] },
              {
                text: ':  ' + this.staff.position.title,
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.salary,
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.khmerMonth(this.staff.hire_date),
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.khmerMonth(this.staff.contract_expiry_date),
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.durationPipe.transform(this.staff.contract_duration),
                margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.status.name,
                margin: [-150, 0, 0, 0]
              }
            ]
          ]
        },

        {
          text: '\n'
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
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 5]
        },
        border: {
          decoration: 'underline'
        },
        color: {
          color: '#203864'
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
