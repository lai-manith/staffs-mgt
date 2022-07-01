import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableStatusPipe } from './pipes/table-status.pipe';



@NgModule({
  declarations: [
    TableStatusPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [TableStatusPipe]
})
export class StatusPipeModule { }
