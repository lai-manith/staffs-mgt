import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageEnum } from '../models/enums/local-storage.enum';
import { NavigationStart, Router } from '@angular/router';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuth);
  authStatus: boolean = this.isAuth;
  constructor(
    private router: Router,
    private requestService: RequestService,
    private localStorageService: LocalStorageService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.authStatus != this.isAuth) {
          this.markStatusChange();
        }
      }
    });
  }

  login(data: { username: string; password: string }): Observable<Login> {
    return this.requestService.postJSON<Login>('/user/login', { data }).pipe(
      map(res => {
        this.localStorageService.set(LocalStorageEnum.token, res.token);
        this.localStorageService.set(LocalStorageEnum.refresh_token, res.refresh_token);
        this.localStorageService.set(LocalStorageEnum.user_id, res.user._id!);
        this.markStatusChange();
        return res;
      })
    );
  }

  logout(): Observable<string> {
    this.localStorageService.delete(LocalStorageEnum.token);
    this.localStorageService.delete(LocalStorageEnum.refresh_token);
    this.localStorageService.delete(LocalStorageEnum.user_id);
    return new Observable<string>(observer => {
      observer.complete(); // complete function will be called when the observable is complete
      this.markStatusChange();
    });
  }

  private markStatusChange() {
    this.authChange$.next(this.isAuth);
    this.authStatus = this.isAuth;
  }

  get isAuth(): boolean {
    return this.localStorageService.get(LocalStorageEnum.token) ? true : false;
  }
}
