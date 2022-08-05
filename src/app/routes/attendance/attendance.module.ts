import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { NameModule } from 'src/app/shares/name/name.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DatepickerArrowModule } from 'src/app/shares/datepicker-arrow/datepicker-arrow.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttendanceHistoryComponent } from './components/attendance-history/attendance-history.component';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { StaticMonthModule } from 'src/app/shares/static-month/static-month.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StaticFileModule } from 'src/app/shares/static-file/static-file.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { AttendanceHistoryRecordComponent } from './components/attendance-history-record/attendance-history-record.component';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AttendanceTranslateModule } from 'src/app/shares/attendance-translate/attendance-translate.module';
import { FilteringModule } from 'src/app/shares/filtering/filtering.module';


@NgModule({
  declarations: [
    AttendanceComponent,
    AttendanceHistoryComponent,
    AttendanceHistoryRecordComponent
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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    EmptyModule,
    StaticMonthModule,
    MatProgressBarModule,
    StaticFileModule,
    MatTooltipModule,
    PaginationModule,
    MatDialogModule,
    AttendanceTranslateModule,
    FilteringModule
  ]
})
export class AttendanceModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/action-icon-set.svg')
    );
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/course-icon-set.svg')
    );
  }
}
