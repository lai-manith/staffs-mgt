import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shares/confirm-dialog/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  @Input() fileName: string;
  defaultImage = '/assets/icons/add-file.svg';
  hasFile = false;

  @Input() file: string = '';
  @Output() uploadCVEvent = new EventEmitter<any>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if (!changes.file?.currentValue) return;
    this.hasFile = true;
  }

  fileChangeEvent(files: FileList) {
    if (files.length) {
      const file = files[0];
      const supportImage = [
        'application/pdf',
        'application/docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      const bytesToMegaBytes = bytes => bytes / 1024 ** 2;
      if (+bytesToMegaBytes(file.size).toFixed(2) > 1) {
        let data = {
          icon: 'assets/imgs/document-unknown.svg',
          title: 'ទំហំឯកសារធំពេក',
          message: 'ទំហំឯកសារធំបំផុត: 1MB'
        };
        return this.dialog.open(ConfirmDialogComponent, {
          width: '420px',
          data
        });
      }

      if (supportImage.includes(file.type)) {
        this.hasFile = true;
        this.fileName = '';
        this.uploadCVEvent.emit({
          file: file,
          file_name: file.name
        });
      } else {
        let data = {
          icon: 'assets/imgs/document-unknown.svg',
          title: 'មិនមែនជាប្រភេទឯកសារ ដែលបានកំណត់',
          message: 'ប្រភេទឯកសារ: PDF, DOC, DOCX'
        };
        return this.dialog.open(ConfirmDialogComponent, {
          width: '420px',
          data
        });
      }
    }
  }

  removeFile() {
    this.fileName = this.defaultImage;
    this.hasFile = false;
    this.uploadCVEvent.emit(null);
  }
}
