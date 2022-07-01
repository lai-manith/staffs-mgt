import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { LocalStorageEnum } from '../models/enums/local-storage.enum';
import { RefreshTokenResponse } from '../models/responses/refresh-token.response';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}
  isRefreshingToken: boolean | undefined;
  tokenBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const refresh_token_url = environment.api_url + '/user/renew_token';
    const refresh_token = this.localStorageService.get(LocalStorageEnum.refresh_token);
    let token = this.localStorageService.get(LocalStorageEnum.token);
    if (req.url == refresh_token_url) {
      req = this.addToken(req, refresh_token);
    } else if (token) {
      req = this.addToken(req, token);
    }
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          console.log('log error', err.status === 401);
          if (req.url === refresh_token_url) {
            this.logout();
          } else if (refresh_token) {
            if (!this.isRefreshingToken) {
              this.isRefreshingToken = true;
              // Reset here so that the following requests wait until the token
              // comes back from the refreshToken call.
              this.tokenBehaviorSubject.next('');
              // get a new token via userService.refreshToken
              return this.http.post<RefreshTokenResponse>(refresh_token_url, {}).pipe(
                switchMap(res => {
                  // did we get a new token retry previous request
                  if (res.data.token) {
                    this.localStorageService.set(LocalStorageEnum.token, res.data.token);
                    this.tokenBehaviorSubject.next(res.data.token);
                    return next.handle(this.addToken(req, res.data.token));
                  }

                  // If we don't get a new token, we are in trouble so logout.
                  this.logout();
                  return throwError(() => new Error(''));
                }),
                finalize(() => {
                  this.isRefreshingToken = false;
                })
              );
            } else {
              return this.tokenBehaviorSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                  return next.handle(this.addToken(req, token));
                })
              );
            }
          } else {
            this.logout();
          }
        }
        if (err.status === 405) {
          this._snackBar.open('ព័ត៌មានគណនីតម្រូវឱ្យបំពេញបន្ថែម', 'បិទ', {
            duration: 5000
          });
          this.router.navigate(['my-teaching/my-information']);
        }
        return throwError(() => err);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
  }

  private logout() {
    this.authService.logout().subscribe(res => {
      this.router.navigateByUrl('');
    });
  }
}
