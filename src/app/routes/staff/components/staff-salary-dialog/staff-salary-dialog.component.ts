import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Staff } from 'src/app/models/staff';
import { SalaryService } from 'src/app/services/salary.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-staff-salary-dialog',
  templateUrl: './staff-salary-dialog.component.html',
  styleUrls: ['./staff-salary-dialog.component.scss']
})
export class StaffSalaryDialogComponent implements OnInit {
  form: FormGroup;
  id: string;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StaffSalaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Staff,
    private snackbarService: SnackbarService,
    private salaryService: SalaryService
  ) {}

  ngOnInit(): void {
    this.onFormControl();
    this.onLoad();
  }

  onFormControl() {
    this.form = this.fb.group({
      current_salary: [''],
      new_salary: ['', Validators.required]
    });
  }

  onLoad() {
    this.form.patchValue({
      current_salary: this.data.salary
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.salaryService.updateSalary(this.data._id, { salary: this.form.value.new_salary }).subscribe(
      res => {
        this.isLoading = false;
        this.snackbarService.onShowSnackbar({
          message: 'ប្រាក់ខែត្រូវបានកែប្រែដោយជោគជ័យ',
          component: SnackbarComponent
        });
        this.dialogRef.close(this.form.value);
      },
      err => {
        console.log(err);
        this.isLoading = false;
        this.snackbarService.onShowSnackbar({
          message: err.error.message,
          component: SnackbarComponent,
          isError: true
        })
      }
    );
  }
}
