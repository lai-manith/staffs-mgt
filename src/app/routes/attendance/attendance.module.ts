import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { NameModule } from 'src/app/shares/name/name.module';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DatepickerArrowModule } from 'src/app/shares/datepicker-arrow/datepicker-arrow.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatTableModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatInputModule,
    NameModule,
    FormsModule,
    MatCardModule,
    DatepickerArrowModule,
    MatProgressSpinnerModule
  ]
})
export class AttendanceModule { }
