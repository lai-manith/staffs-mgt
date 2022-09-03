import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputConfig } from 'ng-otp-input';
import { map } from 'rxjs/operators';
import { MustMatch } from 'src/app/helpers/must-match';
import { User } from 'src/app/models/user';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { StaticFilePipe } from 'src/app/shares/static-file/pipes/static-file.pipe';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  form: FormGroup;
  imgDefault = 'https://res.cloudinary.com/dxrkctl9c/image/upload/v1638865473/image/user-icon_n2sii7.svg';
  imgUrl: string = '';
  imgFile: File;
  @ViewChild('uploader') uploader: ElementRef;
  _id: string = this.route.snapshot.params.id;
  today: Date = new Date();
  // usernameRegex = /^(?=[a-zA-Z0-9._]{0,100}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  resetPasswordForm: FormGroup;
  confirmUpdateForm: FormGroup;
  confirmStatus: FormGroup;
  @ViewChild('ResetPasswordDailog') ResetPasswordDailog: TemplateRef<any>;
  @ViewChild('ConfirmUpdateDialog') ConfirmUpdateDialog: TemplateRef<any>;
  @ViewChild('ConfirmStatus') ConfirmStatus: TemplateRef<any>;
  isActive: boolean;
  imgCloseAccount: string = 'assets/icons/password.svg';
  imgOpenAccount: string =
    'https://res.cloudinary.com/dxrkctl9c/image/upload/v1639122413/image/mobile-login-animate_gv5ma2.svg';
  isSelf: boolean;
  userLoad: User;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private dialog: MatDialog,
    private staticFilePipe: StaticFilePipe
  ) {}

  ngOnInit(): void {
    this.onLoad();
    this.onGetInfo();
  }

  onLoad() {
    this.userService
      .getOne(this._id)
      .pipe(
        map(data => {
          data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          return data;
        })
      )
      .subscribe(
        res => {
          const image = this.staticFilePipe.transform(res.profile) as string;
          this.imgUrl = image;
          this.isActive = res.status;
          this.userLoad = res;
          this.isVerified = res.verified;
        },
        err => {
          this.snackbarService.onShowSnackbar({
            message: err.error.message ?? err.message,
            isError: true,
            component: SnackbarComponent
          });
        }
      );
  }

  onGetInfo() {
    this.userService.getUserLoggedInfo().subscribe(
      res => {
        if (res._id === this._id) this.isSelf = true;
        else this.isSelf = false;
      },
      err =>
        this.snackbarService.onShowSnackbar({
          message: err.error.message ?? err.message,
          isError: true,
          component: SnackbarComponent
        })
    );
  }

  onUpdate() {
    if (!this.isSelf) {
      this.confirmUpdateForm = this.fb.group({
        requester_password: [null, Validators.required]
      });
      this.dialog.open(this.ConfirmUpdateDialog, {
        width: '550px'
      });
    } else this.onConfirmSubmit();
  }

  onConfirmSubmit(): void {
    const DATA = this.isSelf
      ? this.form.value
      : { ...this.form.value, ...{ requester_password: this.confirmUpdateForm.get('requester_password').value } };
    this.userService.updateFile(this._id, DATA).subscribe(
      res => {
        this.form.disable();
        this.snackbarService.onShowSnackbar({ message: 'edit', component: SnackbarComponent });
        this.ngOnInit();
        if (!this.isSelf) this.dialog.closeAll();
        else this.userService.set(res);
      },
      err => {
        let message = err.error.message;
        if (err.error.message === 'Invalid Password') message = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
        this.snackbarService.onShowSnackbar({ message: message, isError: true, component: SnackbarComponent });
      }
    );
  }

  onResetPassword() {
    this.resetPasswordForm = this.fb.group(
      {
        requester_password: [null, Validators.required],
        new_password: [null, [Validators.required, Validators.minLength(8)]],
        confirm_password: [null, [Validators.required, Validators.minLength(8)]]
      },
      {
        validators: MustMatch('new_password', 'confirm_password')
      }
    );
    let dialogRef = this.dialog.open(this.ResetPasswordDailog, {
      width: '550px'
    });
  }

  onChangePassword(data): void {
    if (this.resetPasswordForm.invalid) return;

    delete data.confirm_password;
    this.userService.changePassword(this._id, data).subscribe(
      res => {
        this.snackbarService.onShowSnackbar({ message: 'edit', component: SnackbarComponent });
        this.dialog.closeAll();
        this.form.disable();
      },
      err =>
        this.snackbarService.onShowSnackbar({
          message: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
          isError: true,
          component: SnackbarComponent
        })
    );
  }

  accountStatus: boolean;
  onSetStatusAccount(status) {
    this.confirmStatus = this.fb.group({
      requester_password: [null, Validators.required]
    });
    let dialogRef = this.dialog.open(this.ConfirmStatus, {
      width: '550px'
    });
    this.accountStatus = status;
  }

  onConfirmStatusSubmit() {
    this.userService.setAccountStatus(this._id, this.confirmStatus.value).subscribe(
      res => {
        let message = this.accountStatus ? 'គណនីត្រូវបានបើកជាបណ្ដោះអាសន្ន' : 'គណនីត្រូវបានបិទជាបណ្ដោះអាសន្ន';
        this.snackbarService.onShowSnackbar({ message: message, component: SnackbarComponent });
        this.isActive = this.accountStatus;
        this.onLoad();
        this.dialog.closeAll();
      },
      err => {
        let message = err.error.message ?? err.message;
        if (err.error.message === 'Invalid Password') message = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
        this.snackbarService.onShowSnackbar({ message: message, isError: true, component: SnackbarComponent });
      }
    );
  }

  isVerified: boolean = null;
  isGetCode: boolean = false;
  isCodeExpired: boolean = false;
  invalidCode: boolean = false;
  resendTime: { min: number; sec: number };
  bindEmailForm: FormGroup;
  @ViewChild('BindEmailDialog') BindEmailDialog: TemplateRef<any>;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6
  };
  funcVerifyStatus: number;
  onBindEmail(status: number) {
    this.isGetCode = false;
    this.isCodeExpired = false;
    this.funcVerifyStatus = status;
    this.bindEmailForm = this.fb.group({
      email: [this.userLoad.email, [Validators.email, Validators.required]]
    });
    let dialogRef = this.dialog.open(this.BindEmailDialog, {
      width: '550px',
      panelClass: 'link-email-dialog'
    });
    dialogRef.afterClosed().subscribe(res => {
      clearInterval(this.otpTimer);
    });
  }

  onChangeVerifyEmail(value) {
    this.invalidCode = false;
    console.log(value.length);
    if (value.length == 6) {
      console.log(value.length);
      const data = {
        _id: this._id,
        otp_number: value
      };
      this.userService.changeEmailRequest(data).subscribe(
        res => {
          this.snackbarService.onShowSnackbar({
            message: 'ភ្ជាប់ការប្រើប្រាស់អុីម៉ែលជោគជ័យ',
            component: SnackbarComponent
          });
          this.onLoad();
          this.dialog.closeAll();
        },
        err => {
          this.invalidCode = true;
          this.snackbarService.onShowSnackbar({
            message: 'លេខកូដមិនត្រឹមត្រូវ',
            isError: true,
            component: SnackbarComponent
          });
        }
      );
    }
  }

  onGetCode() {
    if (this.bindEmailForm.valid) {
      this.isGetCode = false;
      this.isCodeExpired = false;
      const data = {
        _id: this._id,
        email: this.bindEmailForm.get('email').value
      };
      this.userService.linkEmailRequest(data).subscribe(
        res => {
          this.isGetCode = true;
          this.startTimer();
        },
        err => {
          if (err.error.message == 'Existed Email') {
            this.snackbarService.onShowSnackbar({
              message: 'អុីម៉ែលនេះបានភ្ជាប់រួចហើយ',
              isError: true,
              component: SnackbarComponent
            });
          } else {
            this.snackbarService.onShowSnackbar({
              message: 'ការផ្ញើលេខកូដបរាជ័យ',
              isError: true,
              component: SnackbarComponent
            });
          }
        }
      );
    }
  }

  onResend() {
    this.onGetCode();
  }

  onOtpChange(value) {
    this.invalidCode = false;
    if (value.length == 6) {
      const data = {
        _id: this._id,
        otp_number: value
      };
      this.userService.linkEmailAccount(data).subscribe(
        res => {
          this.snackbarService.onShowSnackbar({
            message: 'ភ្ជាប់ការប្រើប្រាស់អុីម៉ែលជោគជ័យ',
            component: SnackbarComponent
          });
          this.onLoad();
          this.dialog.closeAll();
        },
        err => {
          this.invalidCode = true;
          this.snackbarService.onShowSnackbar({
            message: 'លេខកូដមិនត្រឹមត្រូវ',
            isError: true,
            component: SnackbarComponent
          });
        }
      );
    }
  }

  otpTimer;
  startTimer() {
    clearInterval(this.otpTimer);
    this.resendTime = {
      min: 1,
      sec: 0
    };
    this.otpTimer = setInterval(() => {
      if (this.resendTime.sec - 1 == -1) {
        this.resendTime.min -= 1;
        this.resendTime.sec = 59;
      } else {
        this.resendTime.sec -= 1;
      }
      if (this.resendTime.min === 0 && this.resendTime.sec === 0) {
        clearInterval(this.otpTimer);
        this.isCodeExpired = true;
      }
    }, 1000);
  }
}
