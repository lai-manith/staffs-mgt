import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilteringRoutingModule } from './filtering-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { SelectionFilterComponent } from './components/selection-filter/selection-filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterComponent } from './components/filter/filter.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StaticMonthModule } from '../static-month/static-month.module';

@NgModule({
  declarations: [
    SelectionFilterComponent,
    FilterComponent
  ],
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
    MatExpansionModule,
    ScrollingModule,
    MatListModule,
    MatChipsModule,
    FormsModule,
    MatRadioModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTooltipModule,
    StaticMonthModule
  ],
  exports: [
    SelectionFilterComponent,
    FilterComponent
  ]
})
export class FilteringModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/action-icons.svg')
    );
  }
}
