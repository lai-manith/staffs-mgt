import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe';
import { User } from 'src/app/models/user';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { StaticFilePipe } from 'src/app/shares/static-file/pipes/static-file.pipe';

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})
export class UserEditingComponent extends Unsubscribe implements OnInit {
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
  imgCloseAccount: string =
    'https://res.cloudinary.com/dxrkctl9c/image/upload/v1639122412/image/coronavirus-border-closure-animate_tarbtg.svg';
  imgOpenAccount: string =
    'https://res.cloudinary.com/dxrkctl9c/image/upload/v1639122413/image/mobile-login-animate_gv5ma2.svg';
  isSelf: boolean = false;
  userLoad: User;
  uploadProgress: number = 0;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private staticFilePipe: StaticFilePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.onFormInit();
    this.onLoad();
    this.onGetInfo();
  }

  onLoad() {
    this.userService
      .getOne(this._id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.imgUrl = res.profile;
          this.isActive = res.status;
          this.userLoad = res;
          this.form.patchValue({
            email: res.email,
            gender: res.gender,
            dob: res?.dob,
            profile: this.staticFilePipe.transform(res.profile) as string,
            first_name: res.first_name,
            last_name: res.last_name
          });
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

  onFormInit() {
    this.form = this.fb.group({
      last_name: [null, Validators.required],
      first_name: [null, Validators.required],
      email: [
        null,
        [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
      ],
      dob: [null, Validators.required],
      profile: [null],
      gender: ['female', Validators.required]
    });

    this.imgUrl = '';
    this.imgFile = null;
  }

  onGetInfo() {
    this.userService
      .getUserLoggedInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          if (res._id === this._id) this.isSelf = true;
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
    this.isLoading = true;
    const DATA = this.isSelf
      ? this.form.value
      : { ...this.form.value, ...{ requester_password: this.confirmUpdateForm.get('requester_password').value } };
    this.userService
      .updateFile(this._id, DATA)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.isLoading = false;
          this.snackbarService.onShowSnackbar({ message: 'edit', component: SnackbarComponent });
          if (!this.isSelf) this.dialog.closeAll();
          else this.userService.set(res);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        err => {
          this.isLoading = false;
          let message = err.error.message;
          if (err.error.message === 'Invalid Password') message = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
          this.snackbarService.onShowSnackbar({ message: message, isError: true, component: SnackbarComponent });
        }
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
}
