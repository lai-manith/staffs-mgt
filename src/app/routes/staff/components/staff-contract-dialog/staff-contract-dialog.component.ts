import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribe } from 'src/app/helpers/unsubscribe';
import { Staff } from 'src/app/models/staff';
import { ContractService } from 'src/app/services/contract.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-staff-contract-dialog',
  templateUrl: './staff-contract-dialog.component.html',
  styleUrls: ['./staff-contract-dialog.component.scss']
})
export class StaffContractDialogComponent extends Unsubscribe implements OnInit {
  form: FormGroup;
  id: string;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StaffContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Staff,
    private snackbarService: SnackbarService,
    private contractService: ContractService
  ) {
    super();
  }

  ngOnInit(): void {
    this.onFormControl();
    this.onLoad();
  }

  onFormControl() {
    this.form = this.fb.group({
      contract_expiry_date: [null],
      hire_date: [null],
      new_expired_contract: [null, Validators.required]
    });
  }

  onLoad() {
    this.form.patchValue({
      contract_expiry_date: formatDate(this.data?.contract_expiry_date, 'dd-MM-yyyy', 'en-US'),
      hire_date: formatDate(this.data?.hire_date, 'dd-MM-yyyy', 'en-US')
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.contractService
      .updateContract(this.data._id, { new_expired_contract: formatDate(this.form.value.new_expired_contract, 'MM-dd-yyyy', 'en-US') })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.isLoading = false;
          this.snackbarService.onShowSnackbar({
            message: 'កុងត្រាត្រូវបានកែប្រែដោយជោគជ័យ',
            component: SnackbarComponent
          });
          this.dialogRef.close(this.form.value);
        },
        err => {
          this.isLoading = false;
          this.snackbarService.onShowSnackbar({
            message:
              err.error.message === 'Invalid date of new contract'
                ? 'ថ្ងៃផុតកុងត្រាថ្មីមិនត្រឹមត្រូវ'
                : err.error.message,
            component: SnackbarComponent,
            isError: true
          });
        }
      );
  }
}
