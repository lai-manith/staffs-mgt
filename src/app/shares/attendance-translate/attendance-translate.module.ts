import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceTranslatePipe } from './attendance-translate.pipe';

@NgModule({
  declarations: [AttendanceTranslatePipe],
  imports: [CommonModule],
  exports: [AttendanceTranslatePipe]
})
export class AttendanceTranslateModule {}
