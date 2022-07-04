import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './components/staff/staff.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { StaticMonthModule } from 'src/app/shares/static-month/static-month.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StaffEditingComponent } from './components/staff-editing/staff-editing.component';
import { StaffCreatingComponent } from './components/staff-creating/staff-creating.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FilteringModule } from 'src/app/shares/filtering/filtering.module';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { StaffListComponent } from './components/staff-list/staff-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { UploaderModule } from 'src/app/shares/uploader/uploader.module';
import { NameModule } from 'src/app/shares/name/name.module';
import { StaticFileModule } from 'src/app/shares/static-file/static-file.module';
import { StaticFilePipe } from 'src/app/shares/static-file/pipes/static-file.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StaffSalaryComponent } from './components/staff-salary/staff-salary.component';
import { StaffSalaryDialogComponent } from './components/staff-salary-dialog/staff-salary-dialog.component';
import { StaffContractComponent } from './components/staff-contract/staff-contract.component';
import { StaffContractDialogComponent } from './components/staff-contract-dialog/staff-contract-dialog.component';


@NgModule({
  declarations: [
    StaffComponent,
    StaffEditingComponent,
    StaffCreatingComponent,
    StaffListComponent,
    StaffSalaryComponent,
    StaffSalaryDialogComponent,
    StaffContractComponent,
    StaffContractDialogComponent,
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    MatIconModule,
    MatButtonModule,
    PaginationModule,
    MatTableModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    MatMenuModule,
    MatBadgeModule,
    StaticMonthModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    FilteringModule,
    EmptyModule,
    MatTabsModule,
    MatCardModule,
    UploaderModule,
    NameModule,
    StaticFileModule,
    MatProgressSpinnerModule,
  ],
  providers: [StaticFilePipe]
})
export class StaffModule { }
