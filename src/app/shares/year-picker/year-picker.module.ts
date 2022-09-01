import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearPickerComponent } from './components/year-picker/year-picker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [YearPickerComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  exports: [YearPickerComponent]
})
export class YearPickerModule { }
