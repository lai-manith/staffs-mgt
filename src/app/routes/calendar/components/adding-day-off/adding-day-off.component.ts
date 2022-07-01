import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-adding-day-off',
  templateUrl: './adding-day-off.component.html',
  styleUrls: ['./adding-day-off.component.scss']
})
export class AddingDayOffComponent implements OnInit {

  form: FormGroup;
  staff: Staff[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddingDayOffComponent>
  ) { }

  ngOnInit(): void {
    this.onFormControl();
  }

  onFormControl() {
    this.form = this.fb.group({
      title: ["", Validators.required],
      title_en: ["", Validators.required],
      description: [""]
    })
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

}
