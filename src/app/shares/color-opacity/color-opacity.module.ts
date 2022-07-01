import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorOpacityPipe } from './pipe/color-opacity.pipe';

@NgModule({
  declarations: [ColorOpacityPipe],
  imports: [CommonModule],
  exports: [ColorOpacityPipe]
})
export class ColorOpacityModule {}
