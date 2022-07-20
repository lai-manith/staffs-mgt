import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  status: number;
  alertMessage: string = '';
  addMessage: string = 'ទិន្នន័យបានរក្សាទុកដោយជោគជ័យ';
  editMessage: string = 'ទិន្នន័យបានកែប្រែដោយជោគជ័យ';
  deleteMessage: string = 'ទិន្នន័យបានលុបដោយជោគជ័យ';
  disableMessage: string = 'ទិន្នន័យបានបិទដោយជោគជ័យ';
  resetPasswordMessage: string = 'ពាក្យសម្ងាត់បានប្ដូរដោយជោគជ័យ';

  constructor(
    public sbRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA)
    public data: any
  ) { }

  ngOnInit(): void {
    this.status = this.data.status;

    switch (this.data.message) {
      case 'add':
        this.alertMessage = this.addMessage;
        break;
      case 'edit':
        this.alertMessage = this.editMessage;
        break;
      case 'delete':
        this.alertMessage = this.deleteMessage;
        break;
      case 'disable':
        this.alertMessage = this.disableMessage;
        break;
      case 'change-password':
        this.alertMessage = this.resetPasswordMessage;
        break;
      default:
        this.alertMessage = this.data.message;
        break;
    }
  }
}
