import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PaginationComponent],
  imports: [CommonModule, MatSelectModule, MatOptionModule, MatIconModule],
  exports: [PaginationComponent]
})
export class PaginationModule { }
