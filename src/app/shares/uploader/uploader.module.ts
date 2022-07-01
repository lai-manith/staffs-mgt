import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DropZoneModule } from '../drop-zone/drop-zone.module';



@NgModule({
  declarations: [
    FileUploaderComponent,
    ImageUploaderComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    DropZoneModule,
  ],
  exports: [
    FileUploaderComponent,
    ImageUploaderComponent
  ],
})
export class UploaderModule { }
