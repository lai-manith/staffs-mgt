import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFromStringPipe } from './pipes/number-from-string.pipe';
import { SecondToMinutePipe } from './pipes/second-to-minute.pipe';
import { MaxMinLengthDirective } from './directive/max-min-length.directive';

@NgModule({
  declarations: [NumberFromStringPipe, SecondToMinutePipe, MaxMinLengthDirective],
  imports: [CommonModule],
  exports: [NumberFromStringPipe, SecondToMinutePipe, MaxMinLengthDirective]
})
export class NumberModule {}
