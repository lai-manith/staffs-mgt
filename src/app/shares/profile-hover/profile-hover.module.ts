import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHoverComponent } from './components/profile-hover/profile-hover.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StaticFileModule } from '../static-file/static-file.module';
import { RouterModule } from '@angular/router';
import { NameModule } from '../name/name.module';



@NgModule({
  declarations: [
    ProfileHoverComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    StaticFileModule,
    NameModule,
    RouterModule
  ],
  exports: [
    ProfileHoverComponent
  ],
})
export class ProfileHoverModule { }
