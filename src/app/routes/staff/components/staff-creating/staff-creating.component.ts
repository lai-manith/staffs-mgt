import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CityProvinces, Districts, Communes, Villages, Nationality } from 'src/app/models/address';
import { Position } from 'src/app/models/position';
import { Staff } from 'src/app/models/staff';
import { AddressService } from 'src/app/services/address.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { StaticFilePipe } from 'src/app/shares/static-file/pipes/static-file.pipe';

@Component({
  selector: 'app-staff-creating',
  templateUrl: './staff-creating.component.html',
  styleUrls: ['./staff-creating.component.scss']
})
export class StaffCreatingComponent implements OnInit {
  form: FormGroup;
  imgDefault = 'https://res.cloudinary.com/dxrkctl9c/image/upload/v1638865473/image/user-icon_n2sii7.svg';
  imgUrl: string = '';
  imgFile: File;
  @ViewChild('uploader') uploader: ElementRef;
  _id: string = this.route.snapshot.params.id;
  today: Date = new Date();
  position: Position[] = [];
  url: string = this.router.url.replace('/create', '');
  uploadProgress: number = 0;
  isLoading: boolean = false;
  isExpired: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialogService: DialogService,
    private readonly positionService: PositionService,
    private snackBarService: SnackbarService,
    private readonly staffService: StaffService,
    private dialog: MatDialog,
    private addressService: AddressService,
    private staticFilePipe: StaticFilePipe
  ) {}

  ngOnInit(): void {
    this.onFormInit();
    this.onGetPosition();
    this.getCityProvinces();

    if (this._id) this.onLoad();
    else this.getNationality();
  }

  onLoad() {
    this.staffService.getById(this.route.snapshot.params.id).subscribe(
      res => {
        let image = this.staticFilePipe.transform(res.profile) as string;
        this.form.patchValue({
          staff_id: res?.staff_id,
          last_name: res.last_name,
          first_name: res.first_name,
          gender: res.gender,
          age: res.age,
          phone: res.phone,
          email: res.email,
          profile: image,
          position: res.position?._id,
          hire_date: res.hire_date,
          contract_expiry_date: res.contract_expiry_date,
          date_of_birth: res.date_of_birth,
          status: res.status,
          attach_files: res.attach_files,
          file_name: res.file_name,
          nationality: res.nationality._id,
          ethnicity: res.ethnicity._id,
          id_card: res.id_card
        });

        this.nationality = [res.nationality];
        this.ethnicity = [res.ethnicity];

        this.imgUrl = image;
        if (res.place_of_birth) {
          this.form.patchValue({
            place_of_birth: {
              city_provinces: res.place_of_birth.city_provinces?._id,
              districts: res.place_of_birth.districts?._id,
              communes: res.place_of_birth.communes?._id,
              villages: res.place_of_birth.villages?._id,
              detail: res.place_of_birth.detail
            }
          });
          this.birthDistricts = res.place_of_birth?.districts ? [res.place_of_birth?.districts] : null;
          this.birthCommunes = res.place_of_birth?.communes ? [res.place_of_birth?.communes] : null;
          this.birthVillages = res.place_of_birth?.villages ? [res.place_of_birth?.villages] : null;
        }

        if (res.address) {
          this.form.patchValue({
            address: {
              city_provinces: res.address.city_provinces?._id,
              districts: res.address.districts?._id,
              communes: res.address.communes?._id,
              villages: res.address.villages?._id,
              detail: res.address.detail
            }
          });
          this.currentDistricts = res.address.districts ? [res.address.districts] : null;
          this.currentCommunes = res.address.communes ? [res.address.communes] : null;
          this.currentVillages = res.address.villages ? [res.address.villages] : null;
        }

        this.isBDClick = false;
        this.isBCClick = false;
        this.isBVClick = false;
        this.isCDClick = false;
        this.isCCClick = false;
        this.isCVClick = false;

        if (this.onFormatDate(this.form.controls['contract_expiry_date'].value) <= this.onFormatDate(new Date())) {
          this.isExpired = true;
        }
      },
      err =>
        this.snackBarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        })
    );
  }

  onFormatDate(date) {
    return new Date(date).setHours(0, 0, 0, 0);
  }

  onSubmit() {
    if (this._id) this.onSubmitUpdate();
    else this.onSubmitCreate();
  }

  onDateChange(event: Date): void {
    this.form.get('age').setValue(+new Date().getFullYear() - +event.getFullYear());
  }

  onSubmitCreate() {
    if (this.form.invalid) return;
    this.isLoading = true;
    let DATA = null;
    DATA = { ...this.form.value };
    DATA.address = JSON.stringify(DATA.address);
    DATA.place_of_birth = JSON.stringify(DATA.place_of_birth);

    this.staffService.postFile(DATA).subscribe(
      res => {
        this.isLoading = false;
        this.snackBarService.onShowSnackbar({
          message: 'add',
          component: SnackbarComponent
        });
        this.router.navigate([this.url + '/detail/' + res._id]);
      },
      err => {
        this.isLoading = false;
        this.snackBarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        });
      }
    );
  }

  onSubmitUpdate() {
    if (this.form.invalid) return;
    this.isLoading = true;
    let DATA = null;
    DATA = { ...this.form.value };

    //TODO: correct data to submit
    DATA.address = JSON.stringify(DATA.address);
    DATA.place_of_birth = JSON.stringify(DATA.place_of_birth);
    this.staffService.updateFile(this._id, DATA).subscribe(
      res => {
        this.isLoading = false;
        this.snackBarService.onShowSnackbar({
          message: 'edit',
          component: SnackbarComponent
        });

        this.onLoad();
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      err => {
        this.isLoading = false;
        this.snackBarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        });
      }
    );
  }

  onFormInit() {
    this.form = this.fb.group({
      last_name: [null, Validators.required],
      first_name: [null, Validators.required],
      gender: [null, Validators.required],
      age: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      nationality: ['', Validators.required],
      ethnicity: ['', Validators.required],
      address: this.fb.group({
        city_provinces: ['', Validators.required],
        districts: ['', Validators.required],
        communes: ['', Validators.required],
        villages: ['', Validators.required],
        detail: ['']
      }),
      place_of_birth: this.fb.group({
        city_provinces: ['', Validators.required],
        districts: ['', Validators.required],
        communes: ['', Validators.required],
        villages: ['', Validators.required],
        detail: ['']
      }),
      staff_id: [null],
      profile: [null],
      attach_files: [null],
      file_name: [null],
      position: [null, Validators.required],
      id_card: [null, Validators.required],
      hire_date: [null, Validators.required],
      date_of_birth: [null, Validators.required],
      salary: this._id ? [null] : [null, Validators.required],
      contract_expiry_date: this._id ? [null] : [null, Validators.required]
    });

    this.imgUrl = '';
    this.imgFile = null;
  }

  onExpiredContact(event) {
    if (this.onFormatDate(event.target.value) < this.onFormatDate(new Date())) {
      this.form.get('contract_expiry_date').setErrors({
        isExpired: true
      });
    }
  }

  onGetPosition() {
    const param = {
      page: 1,
      limit: 0,
      search: ''
    };
    this.positionService.getMany(param).subscribe(
      res => {
        res.list.forEach(element => {
          this.position.push({
            _id: element._id,
            title_en: element.title_en,
            title: element.title
          });
        });
      },
      err =>
        this.snackBarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        })
    );
  }

  fileChange(event: any) {
    if (event != null) {
      this.form.patchValue({
        profile: event
      });
    } else {
      this.form.patchValue({
        profile: ''
      });
    }
  }

  docChange(event: any) {
    if (event != null) {
      this.form.patchValue({
        attach_files: event.file,
        file_name: event.file_name
      });
    } else {
      this.form.patchValue({
        attach_files: '',
        file_name: ''
      });
    }
  }

  cityProvinces: CityProvinces[];
  nationality: Nationality[];
  ethnicity: Nationality[];
  birthDistricts: Districts[];
  birthCommunes: Communes[];
  birthVillages: Villages[];

  //To check address click only allow for 1 time on edit.
  isBDClick: boolean;
  isBCClick: boolean;
  isBVClick: boolean;
  isCDClick: boolean;
  isCCClick: boolean;
  isCVClick: boolean;

  getCityProvinces() {
    this.addressService.getCityProvince().subscribe(res => {
      if (res) {
        this.cityProvinces = res['list'];
      }
    });
  }

  getNationality() {
    this.addressService.getNationality().subscribe(res => {
      if (res) {
        this.ethnicity = res['list'];
        this.nationality = res['list'];
      }
    });
  }

  getBirthDistricts(_id: number) {
    this.addressService.getDistrict(_id).subscribe(res => {
      if (res) {
        this.birthDistricts = res['list'];
      }
    });
  }

  getBirthCommunes(_id: number) {
    this.addressService.getCommune(_id).subscribe(res => {
      if (res) {
        this.birthCommunes = res['list'];
      }
    });
  }

  getBirthVillages(_id: number) {
    this.addressService.getVillage(_id).subscribe(res => {
      if (res) {
        this.birthVillages = res['list'];
      }
    });
  }

  onBirthCityProvinceChange($event) {
    this.form.patchValue({
      place_of_birth: {
        districts: null,
        communes: null,
        villages: null
      }
    });
    this.isBDClick = true;
    this.isBCClick = true;
    this.isBVClick = true;
    this.birthDistricts = [];
    this.birthCommunes = [];
    this.birthVillages = [];
    this.getBirthDistricts($event.value);
  }

  onBirthDistrictClick() {
    if (this.form.get('place_of_birth.city_provinces').value == undefined) {
      return;
    }
    if (this._id && !this.isBDClick) {
      this.isBDClick = true;
      this.getBirthDistricts(this.form.get('place_of_birth.city_provinces').value);
    }
  }

  onBirthDistrictChange($event) {
    this.form.patchValue({
      place_of_birth: {
        communes: null,
        villages: null
      }
    });
    this.isBCClick = true;
    this.isBVClick = true;
    this.birthCommunes = [];
    this.birthVillages = [];
    this.getBirthCommunes($event.value);
  }

  onBirthCommuneClick() {
    if (this.form.get('place_of_birth.communes').value == undefined) {
      return;
    }
    if (this._id && !this.isBCClick) {
      this.isBCClick = true;
      this.getBirthCommunes(this.form.get('place_of_birth.districts').value);
    }
  }

  onBirthCommuneChange($event) {
    this.form.patchValue({
      place_of_birth: {
        villages: null
      }
    });
    this.isBVClick = true;
    this.birthVillages = [];
    this.getBirthVillages($event.value);
  }

  onBirthVillageClick() {
    if (this.form.get('place_of_birth.communes').value == undefined) {
      return;
    }
    if (this._id && !this.isBVClick) {
      this.isBVClick = true;
      this.getBirthVillages(this.form.get('place_of_birth.communes').value);
    }
  }

  currentDistricts: Districts[];
  currentCommunes: Communes[];
  currentVillages: Villages[];

  getCurrentDistricts(_id: number) {
    this.addressService.getDistrict(_id).subscribe(res => {
      if (res) {
        this.currentDistricts = res['list'];
      }
    });
  }

  getCurrentCommunes(_id: number) {
    this.addressService.getCommune(_id).subscribe(res => {
      if (res) {
        this.currentCommunes = res['list'];
      }
    });
  }

  getCurrentVillages(_id: number) {
    this.addressService.getVillage(_id).subscribe(res => {
      if (res) {
        this.currentVillages = res['list'];
      }
    });
  }

  onCurrentCityProvinceChange($event) {
    this.form.patchValue({
      address: {
        districts: null,
        communes: null,
        villages: null
      }
    });
    this.isCDClick = true;
    this.isCCClick = true;
    this.isCVClick = true;
    this.currentDistricts = [];
    this.currentCommunes = [];
    this.currentVillages = [];
    this.getCurrentDistricts($event.value);
  }

  onCurrentDistrictClick() {
    if (this.form.get('address.city_provinces').value == undefined) {
      return;
    }
    if (this._id && !this.isCDClick) {
      this.isCDClick = true;
      this.getCurrentDistricts(this.form.get('address.city_provinces').value);
    }
  }

  onCurrentDistrictChange($event) {
    this.form.patchValue({
      address: {
        communes: null,
        villages: null
      }
    });
    this.isCCClick = true;
    this.isCVClick = true;
    this.currentCommunes = [];
    this.currentVillages = [];
    this.getCurrentCommunes($event.value);
  }

  onCurrentCommuneClick() {
    if (this.form.get('address.districts').value == undefined) {
      return;
    }
    if (this._id && !this.isCCClick) {
      this.isCCClick = true;
      this.getCurrentCommunes(this.form.get('address.districts').value);
    }
  }

  onCurrentCommuneChange($event) {
    this.form.patchValue({
      address: {
        villages: null
      }
    });
    this.isCVClick = true;
    this.currentVillages = [];
    this.getCurrentVillages($event.value);
  }

  onCurrentVillageClick() {
    if (this.form.get('address.communes').value == undefined) {
      return;
    }
    if (this._id && !this.isCVClick) {
      this.isCVClick = true;
      this.getCurrentVillages(this.form.get('address.communes').value);
    }
  }
}
