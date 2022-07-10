import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from 'src/app/helpers/must-match';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-user-creating',
  templateUrl: './user-creating.component.html',
  styleUrls: ['./user-creating.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(10px, 0)' }),
        animate('100ms', style({ opacity: 1, transform: 'translate(0, 0)' }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translate(0, 0)'
        }),
        animate('100ms', style({ opacity: 0, transform: 'translate(10px, 0)' }))
      ])
    ])
  ]
})
export class UserCreatingComponent implements OnInit {
  form: FormGroup;
  imgDefault = 'https://res.cloudinary.com/dxrkctl9c/image/upload/v1638865473/image/user-icon_n2sii7.svg';
  imgUrl: string = '';
  imgFile: File;
  @ViewChild('uploader') uploader: ElementRef;
  _id: string = this.route.snapshot.params.id;
  today: Date = new Date();
  usernameRegex = /^(?=[a-zA-Z0-9._]{0,100}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  id: string;
  uploadProgress:number = 0;
  isLoading: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialogService: DialogService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.onFormInit();
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading = true;
    const DATA = this.form.value;
    delete DATA.confirm_password;
    this.userService.postFile(DATA).subscribe(
      res => {
        this.isLoading = false;
        this.snackbarService.onShowSnackbar({
          message: 'add',
          component: SnackbarComponent
        });
        this.router.navigate(['/setting/manage-user/detail/' + res._id]);
      },
      err => {
        this.isLoading = false;
        this.snackbarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        })
      }
    );
  }

  onValidateUsername(data: string) {
    this.startSearch(data);
  }

  inputTime;
  startSearch(data: string) {
    clearTimeout(this.inputTime);
    this.inputTime = setTimeout(() => {
      this.userService.checkDuplicated({ username: data }).subscribe(res => {
        if (res.find) this.form.get('username').setErrors({ duplicated: true });
      });
    }, 500);
  }

  onFormInit() {
    this.form = this.fb.group(
      {
        last_name: [null, Validators.required],
        first_name: [null, Validators.required],
        email: [
          null,
          [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ],
        dob: [null, Validators.required],
        profile: [null],
        gender: [null, Validators.required],
        username: [
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
            Validators.pattern(this.usernameRegex)
          ]
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', Validators.required]
      },
      {
        validators: MustMatch('password', 'confirm_password')
      }
    );

    this.imgUrl = '';
    this.imgFile = null;
  }

  fileChange(event: any) {
    console.log(event);
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
