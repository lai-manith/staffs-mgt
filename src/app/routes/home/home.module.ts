import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FilteringModule } from 'src/app/shares/filtering/filtering.module';
import { ChartModule } from 'src/app/shares/chart/chart.module';
import { DomSanitizer } from '@angular/platform-browser';
import { FacultyListComponent } from './components/faculty-list/faculty-list.component';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StaticMonthModule } from 'src/app/shares/static-month/static-month.module';
import { StaticFileModule } from 'src/app/shares/static-file/static-file.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [HomeComponent, FacultyListComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    FilteringModule,
    ChartModule,
    MatTableModule,
    PaginationModule,
    MatTooltipModule,
    EmptyModule,
    MatProgressBarModule,
    StaticMonthModule,
    StaticFileModule, MatMenuModule
  ]
})
export class HomeModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg-icon-set.svg')
    );
  }
}
