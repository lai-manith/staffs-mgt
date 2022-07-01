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

  constructor(
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialogService: DialogService,
    private snackBarService: SnackbarService,
    private readonly staffService: StaffService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    this.staffService.getById(this.route.snapshot.params.id)
    .pipe(
      map(data => {
        this.isActive = data.status;
        data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
        data.status =
          data.status === true ? { name: 'សកម្ម', name_en: 'active' } : { name: 'អសកម្ម', name_en: 'inactive' };
        return data;
      })
    )
    .subscribe(
      res => {
        this.staff = res;
      },
      err =>
        this.snackBarService.onShowSnackbar({
          message: err.message ?? err,
          component: SnackbarComponent,
          isError: true
        })
    );
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
    this.dialogService.onShowDialog({title: 'បញ្ឈប់បុគ្គលិក', message: "តើអ្នកពិតជាចង់បញ្ឈប់បុគ្គលិកនេះមែនទេ?", icon: 'assets/icons/warning.svg'})
    .afterClosed().subscribe(res => {
      if(res === "confirm") {
        this.onConfirmStatusSubmit(status)
      }
    })
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

  onPrint() {
    let pdfTitle: string = "CURRICULUM VITAE";

    const DATA = {
      pageSize: 'A4',
      content: [
        {
          text: pdfTitle, style: ['header', 'alignCenter', 'color']
        },

        {
          text: this.staff.first_name + ' ' + this.staff.last_name,
          style: ['sectionHeader', 'color', {fontSize: 15}],
        },
        {
          columns: [
            [
              { text: 'Address' },
              { text: 'Phone' },
              { text: 'E-mail' },
            ],
            [
              { text: ':  ST 6A, Sangkat Prek Leap, Khan Chroy Chongva, Phnom Penh.', margin: [-150, 0, 0, 0]},
              {
                text: ':  ' + this.staff.phone, margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.email, margin: [-150, 0, 0, 0]
              }
            ]
          ]
        },

        {
          text: '\n'
        },

        {
          text: '1. PERSONAL DATA',
          style: ['sectionHeader', 'color', 'border'],
        },
        {
          columns: [
            [
              { text: 'Sex' },
              { text: 'Date of Birth' },
              { text: 'Place of Birth' },
              { text: 'Nationality' },
              { text: 'Marital Status' },
              { text: 'Health Situation' },
              { text: 'Apply For' },
            ],
            [
              { text: ':  ' + this.staff.gender, margin: [-150, 0, 0, 0]},
              {
                text: ':  ' + this.staff.date_of_birth, margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.place_of_birth.city_provinces, margin: [-150, 0, 0, 0]
              },
              {
                text: ':  Khmer', margin: [-150, 0, 0, 0]
              },
              {
                text: ':  Single', margin: [-150, 0, 0, 0]
              },
              {
                text: ':  Excellent', margin: [-150, 0, 0, 0]
              },
              {
                text: ':  ' + this.staff.position.title, margin: [-150, 0, 0, 0]
              },
            ]
          ]
        },

        {
          text: '\n'
        },

        {
          text: '2. ACADEMIC BACKGROUND',
          style: ['sectionHeader', 'color', 'border'],
        },
        {
          columns: [
            [
              { text: '2018 - 2020' },
              { text: ' '},
              { text: '2017 - 2018' },
            ],
            [
              {
                text: ':  The Fourth Year for Bachelor Degree of Information Technology at Asia Euro University (AEU) Gold Building.', margin: [-150, 0, 0, 0]
              },
              {
                text: ':  Foundation Year of Information Technology at AEU.', margin: [-150, 0, 0, 0]
              }
            ]
          ]
        },

        {
          text: '\n'
        },


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
          bold: true,
          fontSize: 12,
          margin: [0, 0, 0, 5]
        },
        border: {
          decoration: 'underline',
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
