import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SnackbarComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [SnackbarComponent]
})
export class SnackbarModule {}
