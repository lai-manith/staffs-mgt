import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ContainerComponent } from './components/container/container.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { NameModule } from './shares/name/name.module';
import { SnackbarModule } from './shares/snackbar/snackbar.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from './shares/confirm-dialog/confirm-dialog.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';
import { AuthInterceptor } from './intercptors/auth.interceptor';
import { NotificationModule } from './routes/notification/notification.module';
import { StaticFileModule } from './shares/static-file/static-file.module';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, ContainerComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    NameModule,
    SnackbarModule,
    ConfirmDialogModule,
    MatTooltipModule,
    NotificationModule,
    StaticFileModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [['bold', 'italic'], [{ align: [] }], ['link', 'image']]
      },
      placeholder: '*'
    })
  ],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    /**
     * Is used for refresh token
     */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

