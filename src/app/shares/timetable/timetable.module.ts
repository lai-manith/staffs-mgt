import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableComponent } from './components/timetable/timetable.component';
import { MatTableModule } from '@angular/material/table';
import { StaticTimeModule } from '../static-time/static-time.module';
import { KhmerWeekModule } from '../khmer-week/khmer-week.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorOpacityModule } from '../color-opacity/color-opacity.module';
import { NameModule } from '../name/name.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [TimetableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    StaticTimeModule,
    KhmerWeekModule,
    ColorOpacityModule,
    NameModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [TimetableComponent]
})
export class TimetableModule {}
