import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { StaffGenderByYearComponent } from './components/staff-gender-by-year/staff-gender-by-year.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChartModule } from 'src/app/shares/chart/chart.module';
import { MatCardModule } from '@angular/material/card';
import { YearPickerModule } from 'src/app/shares/year-picker/year-picker.module';
import { StaffPositionByYearComponent } from './components/staff-position-by-year/staff-position-by-year.component';
import { StaffProvinceByYearComponent } from './components/staff-province-by-year/staff-province-by-year.component';


@NgModule({
  declarations: [
    StaffGenderByYearComponent,
    StaffPositionByYearComponent,
    StaffProvinceByYearComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    MatBadgeModule,
    MatTableModule,
    PaginationModule,
    MatSidenavModule,
    ChartModule,
    MatCardModule,
    YearPickerModule
  ]
})
export class ReportModule { }
