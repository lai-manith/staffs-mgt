import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionRoutingModule } from './position-routing.module';
import { PositionComponent } from './components/position/position.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { PositionCreatingComponent } from './components/position-creating/position-creating.component';
import { PositionEditingComponent } from './components/position-editing/position-editing.component';
import { FilteringModule } from 'src/app/shares/filtering/filtering.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [
    PositionComponent,
    PositionCreatingComponent,
    PositionEditingComponent
  ],
  imports: [
    CommonModule,
    PositionRoutingModule,
    MatTableModule,
    PaginationModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    FilteringModule,
    MatCardModule,
    MatProgressBarModule,
    EmptyModule
  ]
})
export class PositionModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/action-icon-set.svg')
    );
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/course-icon-set.svg')
    );
  }
}
