import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CalendarDatePipe } from 'src/app/shares/calendar-date/pipes/calendar-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { StaticMonthModule } from 'src/app/shares/static-month/static-month.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { AddingDayOffComponent } from './components/adding-day-off/adding-day-off.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentListDialogComponent } from './components/student-list-dialog/student-list-dialog.component';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { CalendarDateModule } from 'src/app/shares/calendar-date/calendar-date.module';
import { FilteringModule } from 'src/app/shares/filtering/filtering.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { NameModule } from 'src/app/shares/name/name.module';
import { StaticFileModule } from 'src/app/shares/static-file/static-file.module';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileHoverModule } from 'src/app/shares/profile-hover/profile-hover.module';


@NgModule({
  declarations: [
    CalendarComponent,
    AddingDayOffComponent,
    StudentListDialogComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatIconModule,
    MatButtonModule,
    StaticMonthModule,
    MatMenuModule,
    MatBadgeModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    PaginationModule,
    MatTableModule,
    MatDividerModule,
    CalendarDateModule,
    FilteringModule,
    MatProgressBarModule,
    EmptyModule,
    NameModule,
    StaticFileModule,
    ProfileHoverModule
  ]
})
export class CalendarModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/action-icon-set.svg')
    );
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/course-icon-set.svg')
    );
  }
}
