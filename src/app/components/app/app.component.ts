import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'admin';
  isLoading = false;
  loadingTimeout: any;
  constructor(
    private router: Router,
    public loadingService: LoadingService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.forceStop();
        this.loadingService.setLoading(true);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // scroll to top on navigate finish
        // window.scrollTo({top:0})
        this.loadingService.setLoading(false);
      }
    });
    // delay to hide some quick loading
    this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
      this.loadingTimeout = setTimeout(() => {
        this.isLoading = isLoading;
        this.loadingTimeout = null;
      }, 300);
    });
  }
}
