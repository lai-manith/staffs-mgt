import { NgModule } from '@angular/core';
import { PhoneSpacePipe } from './pipes/phone-space.pipe';

@NgModule({
  declarations: [
    PhoneSpacePipe
  ],
  exports: [
    PhoneSpacePipe
  ]
})
export class PhoneModule { }
