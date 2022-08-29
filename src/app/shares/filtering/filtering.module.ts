import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilteringRoutingModule } from './filtering-routing.module';
import { FilterWithCreateNewComponent } from './components/filter-with-create-new/filter-with-create-new.component';
import { FilterWithoutCreateNewComponent } from './components/filter-without-create-new/filter-without-create-new.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FilterWithPrintingComponent } from './components/filter-with-printing/filter-with-printing.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { SelectionFilterComponent } from './components/selection-filter/selection-filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YearPickerModule } from '../year-picker/year-picker.module';

@NgModule({
  declarations: [FilterWithCreateNewComponent, FilterWithoutCreateNewComponent, FilterWithPrintingComponent, SelectionFilterComponent],
  imports: [
    CommonModule,
    FilteringRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatBadgeModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NativeDateModule,
    MatTooltipModule,
    YearPickerModule
  ],
  exports: [FilterWithCreateNewComponent, FilterWithoutCreateNewComponent, FilterWithPrintingComponent, SelectionFilterComponent]
})
export class FilteringModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/action-icons.svg')
    );
  }
}
