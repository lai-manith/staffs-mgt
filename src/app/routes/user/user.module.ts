import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { NameModule } from 'src/app/shares/name/name.module';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PaginationModule } from 'src/app/shares/pagination/pagination.module';
import { StaticMonthModule } from 'src/app/shares/static-month/static-month.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserCreatingComponent } from './components/user-creating/user-creating.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FilteringModule } from 'src/app/shares/filtering/filtering.module';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploaderModule } from 'src/app/shares/uploader/uploader.module';
import { MatDividerModule } from '@angular/material/divider';
import { UserEditingComponent } from './components/user-editing/user-editing.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { StaticFileModule } from 'src/app/shares/static-file/static-file.module';
import { StaticFilePipe } from 'src/app/shares/static-file/pipes/static-file.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [UserListComponent, UserDetailComponent, UserCreatingComponent, UserEditingComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NameModule,
    MatIconModule,
    MatButtonModule,
    PaginationModule,
    MatTableModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    StaticMonthModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatProgressBarModule,
    FilteringModule,
    EmptyModule,
    MatTooltipModule,
    UploaderModule, MatDividerModule,
    NgOtpInputModule,
    MatDividerModule,
    StaticFileModule,
    MatProgressSpinnerModule
  ],
  providers: [StaticFilePipe]
})
export class UserModule { }
