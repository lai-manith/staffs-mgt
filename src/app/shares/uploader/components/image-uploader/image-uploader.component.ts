import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shares/confirm-dialog/components/confirm-dialog/confirm-dialog.component';
import { ImageCroppedEvent } from 'src/app/shares/image-cropper/interfaces';
@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  isSuccessful: boolean = false;
  imageUrl: string | ArrayBuffer;
  fileName: string;
  isFile: boolean = false;

  @Input() uploadProgress: number;
  @Input() file: File;
  @Input() onSubmit: boolean;
  @Output() uploadFileEvent = new EventEmitter();
  @Output() fileEvent = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if (changes.uploadProgress?.currentValue as number) {
      this.uploadProgress = changes.uploadProgress?.currentValue;
      if (this.uploadProgress === 100) {
        this.isSuccessful = true;
      }
    } else {
      this.uploadProgress = null;
    }

    if (changes.file?.currentValue) {
      if (changes.file?.currentValue instanceof File) {
        const fr = new FileReader();
        fr.readAsDataURL(changes.file?.currentValue);
        fr.onload = () => {
          this.imageUrl = fr.result;
        };
      } else this.imageUrl = changes.file.currentValue;
    }

    this.isFile = this.file instanceof File ?? false;
  }

  fileChange(files: FileList) {
    this.fileName = files[0].name;
    if (files.length) {
      const file = files[0];
      const supportImage = ['image/jpeg', 'image/png', 'image/jpg'];
      if (supportImage.includes(file.type)) {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => {
          this.imageUrl = fr.result;
        };
        this.uploadFileEvent.emit(file);
      } else {
        let data = {
          icon: 'assets/imgs/document-unknown.svg',
          title: 'មិនមែនជាប្រភេទរូបភាព ដែលបានកំណត់',
          message: 'ប្រភេទរូបភាព: PNG, JPG, JPEG'
        };
        this.dialog.open(ConfirmDialogComponent, {
          width: '420px',
          data
        });
      }
    }
  }

  removeFile() {
    this.file = null;
    this.uploadFileEvent.emit(null);
  }
}
