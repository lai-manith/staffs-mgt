import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shares/confirm-dialog/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  onShowDialog(data: { title?: string; message?: string; icon?: string; button?: string }): MatDialogRef<any> {
    if (data.title === '') data.title = null;
    if (data.message === '') data.message = null;
    const DIALOG_REF = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog-custom',
      data: {
        icon: data.icon ?? '/assets/imgs/delete.svg',
        title: data.title ?? 'លុបទិន្នន័យនេះ',
        message: data.message ?? 'តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនឫទេ?',
        button: data.button ?? 'confirm'
      }
    });
    return DIALOG_REF;
  }
}
