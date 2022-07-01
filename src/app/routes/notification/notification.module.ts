import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DateTimeModule } from 'src/app/shares/date-time/date-time.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationRoutingModule } from './notification-routing.module';
import { EmptyModule } from 'src/app/shares/empty/empty.module';
import { DomSanitizer } from '@angular/platform-browser';
import { StaticFileModule } from 'src/app/shares/static-file/static-file.module';

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    DateTimeModule,
    EmptyModule,
    StaticFileModule
  ],
  exports: [NotificationComponent]
})
export class NotificationModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/action-icon-set.svg')
    );
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/course-icon-set.svg')
    );
  }
}
