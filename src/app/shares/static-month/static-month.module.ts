import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthPipe } from './pipe/month.pipe';
import { DurationPipe } from './pipe/duration.pipe';

@NgModule({
  declarations: [MonthPipe, DurationPipe],
  imports: [
    CommonModule
  ],
  exports: [MonthPipe, DurationPipe]
})
export class StaticMonthModule { }
