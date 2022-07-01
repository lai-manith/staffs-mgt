import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbSemesterComponent } from './components/tb-semester/tb-semester.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    TbSemesterComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatTooltipModule
  ],
  exports: [TbSemesterComponent]
})
export class TbSemesterModule { }
