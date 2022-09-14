import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticFilePipe } from './pipes/static-file.pipe';
import { StaticImagePipe } from './pipes/static-image.pipe';

@NgModule({
  declarations: [StaticFilePipe, StaticImagePipe],
  imports: [CommonModule],
  exports: [StaticFilePipe, StaticImagePipe]
})
export class StaticFileModule {}
