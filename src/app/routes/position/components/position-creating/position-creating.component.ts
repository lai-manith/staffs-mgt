import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-position-creating',
  templateUrl: './position-creating.component.html',
  styleUrls: ['./position-creating.component.scss']
})
export class PositionCreatingComponent implements OnInit {
  form: FormGroup;
  _id: string = this.route.snapshot.params.id;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    this.onFormInit();
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.positionService.create(this.form.value).subscribe(
      res => {
        this.snackbarService.onShowSnackbar({ message: 'add', component: SnackbarComponent });
        this.router.navigate(['/setting/manage-position/detail/' + res._id]);
      },
      err => {
        this.snackbarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        });
      }
    );
  }

  onFormInit() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      title_en: [null, Validators.required],
      description: [null, Validators.required]
    });
  }
}
