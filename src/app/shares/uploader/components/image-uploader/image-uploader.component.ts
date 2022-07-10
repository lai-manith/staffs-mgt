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

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

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
    this.imageChangedEvent = files;
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
          title: 'Unsupported File Type',
          message: 'Support file type: PNG, JPG, JPEG'
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

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageCropped(event: ImageCroppedEvent) {
    const imageName = this.fileName;
    const imageBlob = this.dataURItoBlob(event.base64);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
    this.uploadFileEvent.emit(imageFile);
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
    });
  }

}
