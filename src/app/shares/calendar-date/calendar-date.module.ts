import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDatePipe } from './pipes/calendar-date.pipe';



@NgModule({
  declarations: [CalendarDatePipe],
  imports: [
    CommonModule
  ],
  exports: [CalendarDatePipe]
})
export class CalendarDateModule { }
