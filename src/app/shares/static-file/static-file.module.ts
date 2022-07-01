import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticFilePipe } from './pipes/static-file.pipe';

@NgModule({
  declarations: [StaticFilePipe],
  imports: [CommonModule],
  exports: [StaticFilePipe]
})
export class StaticFileModule {}
