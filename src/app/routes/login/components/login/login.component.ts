import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MustMatch } from 'src/app/helpers/must-match';
import { Unsubscribe } from 'src/app/helpers/unsubscribe';
import { RoleEnum } from 'src/app/models/enums/role.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(10px, 0)' }),
        animate('300ms', style({ opacity: 1, transform: 'translate(0, 0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translate(0, 0)' }),
        animate('300ms', style({ opacity: 0, transform: 'translate(10px, 0)' }))
      ])
    ]),
    trigger('fadeLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-200px, 0)' }),
        animate('300ms', style({ opacity: 1, transform: 'translate(0, 0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translate(0, 0)' }),
        animate('300ms', style({ opacity: 0, transform: 'translate(-200px, 0)' }))
      ])
    ]),
    trigger('fastFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(50px, 0)' }),
        animate('300ms', style({ opacity: 1, transform: 'translate(0, 0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translate(0, 0)' }),
        animate('0ms', style({ opacity: 0, transform: 'translate(50px, 0)' }))
      ])
    ]),
    trigger('fastFadeLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50px, 0)' }),
        animate('300ms', style({ opacity: 1, transform: 'translate(0, 0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translate(0, 0)' }),
        animate('0ms', style({ opacity: 0, transform: 'translate(-50px, 0)' }))
      ])
    ])
  ]
})
export class LoginComponent extends Unsubscribe implements OnInit {
  form: FormGroup;
  loading = false;
  formResetPassword: FormGroup;
  isForgotPassword: boolean = false;
  formState: number = 0;
  formEmail: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private profileService: ProfileService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.router.navigate(['']);
      },
      err => {
        this.loading = false;
        let message;
        if (err.error.message === 'Not Allowed') message = 'គណនីនេះមិនអនុញ្ញាតឲ្យចូលប្រព័ន្ធទេ';
        else if (err.error.status === 0) message = 'ឈ្មោះ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
        this.snackbarService.onShowSnackbar({ message: message, isError: true, component: SnackbarComponent });
      }
    );
  }

  onForgotPassword() {
    this.form.reset();
    this.formEmail = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
    this.formState++;
  }

  onBackToLogin() {
    this.formState = 0;
  }

  onBackToEmail() {
    this.formState = 1;
  }

  isCodeExpired: boolean = false;
  invalidCode: boolean = false;
  resendTime: { min: number; sec: number };
  expireTime: { min: number; sec: number };
  config = {
    allowNumbersOnly: true,
    length: 6
  };
  emailToken: string = '';
  passwordToken: string = '';
  id: string;

  onGetCode() {
    if (this.formEmail.valid) {
      this.isCodeExpired = false;
      const data = {
        email: this.formEmail.get('email').value
      };
      this.profileService.requestOTP(data).pipe(takeUntil(this.unsubscribe$)).subscribe(
        res => {
          this.formState = 2;
          this.startTimer();
          this.id = res.owner;
        },
        err => {
          if (err.error.message == 'This email is not verify') {
            this.snackbarService.onShowSnackbar({
              message: 'អុីម៉ែលនេះបានភ្ជាប់រួចហើយ',
              isError: true,
              component: SnackbarComponent
            });
          } else if (err.error.message == 'Not Found Email') {
            this.snackbarService.onShowSnackbar({
              message: 'មិនមានគណនីអុីម៉ែលនេះទេ',
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
    if (this.formEmail.valid) {
      this.isCodeExpired = false;
      const data = {
        _id: this.id,
        email: this.formEmail.get('email').value
      };
      this.profileService.requestOTP(data).pipe(takeUntil(this.unsubscribe$)).subscribe(
        res => {
          this.formState = 2;
          this.startTimer();
        },
        err => {
          if (err.error.message == 'This email is not verify') {
            this.snackbarService.onShowSnackbar({
              message: 'អុីម៉ែលនេះបានភ្ជាប់រួចហើយ',
              isError: true,
              component: SnackbarComponent
            });
          } else if (err.error.message == 'Not Found Email') {
            this.snackbarService.onShowSnackbar({
              message: 'មិនមានគណនីអុីម៉ែលនេះទេ',
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

  onOtpChange(value) {
    this.invalidCode = false;
    if (value.length == 6) {
      this.formResetPassword = this.formBuilder.group(
        {
          new_password: [null, [Validators.required, Validators.minLength(8)]],
          confirm_password: [null, Validators.required]
        },
        {
          validators: MustMatch('new_password', 'confirm_password')
        }
      );
      const data = {
        _id: this.id,
        otp_number: value
      };
      this.profileService.verifyOTP(data).pipe(takeUntil(this.unsubscribe$)).subscribe(
        res => {
          this.startTokenTimer();
          this.formState = 3;
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

  tokenTimer;
  startTokenTimer() {
    clearInterval(this.tokenTimer);
    this.expireTime = {
      min: 5,
      sec: 0
    };
    this.tokenTimer = setInterval(() => {
      if (this.expireTime.sec - 1 == -1) {
        this.expireTime.min -= 1;
        this.expireTime.sec = 59;
      } else {
        this.expireTime.sec -= 1;
      }
      if (this.expireTime.min === 0 && this.expireTime.sec === 0) {
        clearInterval(this.tokenTimer);
        //Token expired will redirect to login
      }
    }, 1000);
  }

  onSubmitReset() {
    if (this.formResetPassword.valid) {
      const data = {
        _id: this.id,
        password: this.formResetPassword.get('new_password').value
      };
      this.profileService.changePassword(data).pipe(takeUntil(this.unsubscribe$)).subscribe(
        res => {
          this.snackbarService.onShowSnackbar({
            message: 'ការកំណត់ពាក្យសម្ងាត់ថ្មីជោគជ័យ',
            component: SnackbarComponent
          });
          clearInterval(this.tokenTimer);
          this.formState = 0;
        },
        err => {
          this.snackbarService.onShowSnackbar({
            message: 'ការកំណត់ពាក្យសម្ងាត់ថ្មីបរាជ័យ',
            isError: true,
            component: SnackbarComponent
          });
        }
      );
    }
  }
}
