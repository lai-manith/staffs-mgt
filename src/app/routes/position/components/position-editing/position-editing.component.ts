import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe';
import { DialogService } from 'src/app/services/dialog.service';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-position-editing',
  templateUrl: './position-editing.component.html',
  styleUrls: ['./position-editing.component.scss']
})
export class PositionEditingComponent extends Unsubscribe implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;
  _id: string = this.route.snapshot.params.id;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialogService: DialogService,
    private positionService: PositionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.onFormInit();
    this.onLoad();
  }

  onLoad() {
    this.positionService.getById(this._id).pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.form.patchValue({
          title: res.title,
          title_en: res.title_en,
          description: res.description
        });
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

    this.form.disable();
    this.isEdit = false;
  }

  onUpdate() {
    this.positionService.update(this._id, this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.form.disable();
        this.snackbarService.onShowSnackbar({
          message: 'edit',
          component: SnackbarComponent
        });
        this.ngOnInit();
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

  onDelete() {
    this.dialogService
      .onShowDialog({})
      .afterClosed()
      .subscribe(res => {
        if (res === 'confirm') {
          this.positionService.delete(this._id).pipe(takeUntil(this.unsubscribe$)).subscribe(
            res => {
              this.router.navigate(['/setting/manage-position']);
              this.snackbarService.onShowSnackbar({
                message: 'delete',
                component: SnackbarComponent
              });
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
      });
  }

  onEdit() {
    this.isEdit = true;
    this.form.enable();
  }

  onCancel() {
    this.isEdit = false;
    this.form.disable();
    this.onLoad();
  }
}
