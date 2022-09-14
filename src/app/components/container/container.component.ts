import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChildItem, MenuItem } from 'src/app/models/menu-item';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menu!: MenuItem[];
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  sidebarMode: any;
  mobileQuery!: boolean;
  smallScreen!: boolean;
  authUser!: object;
  isAuth!: boolean;
  account: any;
  activeAcademicYear!: string;
  authSubscribe: any;
  menuAdmin!: MenuItem[];
  routeId: number;
  constructor(
    public route: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private userDataService: UserDataService,
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private snackBarService: SnackbarService
  ) {
    this.menuAdmin = [
      {
        title: 'ទំព័រដើម',
        route: '/home',
        icon: '',
        svgIcon: 'dashboard',
        child: [],
        permissions: []
      },
      {
        title: 'បុគ្គលិក',
        route: 'staff',
        icon: '',
        svgIcon: 'staff',
        permissions: [],
        child: [
          {
            title: 'បង្កើតថ្មី',
            route: ['/staff/create'],
            icon: '',
            svgIcon: 'create',
            permissions: []
          },
          {
            title: 'បញ្ជីបុគ្គលិក',
            route: ['/staff/staff-active'],
            icon: '',
            svgIcon: 'listing',
            permissions: []
          }
        ]
      },
      {
        title: 'សម្រង់វត្តមាន',
        route: 'attendance',
        icon: '',
        svgIcon: 'attendance',
        permissions: [],
        child: []
      },
      {
        title: 'ប្រតិទិនឈប់សម្រាក',
        route: '/calendar',
        icon: '',
        svgIcon: 'calendar',
        permissions: [],
        child: []
      },
      {
        title: 'របាយការណ៍',
        route: '/report',
        icon: '',
        svgIcon: 'report',
        child: [
          {
            title: 'បុគ្គលិកតាមអាយុនិងភេទ',
            route: ['/report/by_gender'],
            icon: 'transgender',
            svgIcon: '',
            permissions: []
          },
          {
            title: 'បុគ្គលិកតាមតំណែង',
            route: ['/report/by_position'],
            icon: 'diversity_3',
            svgIcon: '',
            permissions: []
          }
        ],
        permissions: []
      },
      {
        title: 'ការកំណត់',
        route: '/setting',
        icon: '',
        svgIcon: 'setting',
        child: [],
        permissions: []
      }
    ];
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/svg-icon-set.svg')
    );
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/side-nav-icon-set.svg')
    );

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.routeId = event.id;
    //   }
    // });

    this.authSubscribe = this.authService.authChange$.subscribe(isAuth => {
      this.isAuth = isAuth;
      if (this.isAuth) {
        this.profileService.getAccountInfo().subscribe(
          data => {
            this.account = data;
            this.profileService.staffId = data._id;
            this.userDataService.changeUserData(data);
            localStorage.setItem('account', JSON.stringify(data));
            this.initSidenav();
          },
          err => {
            if (err.error.message == 'Not Found Data') {
              this.snackBarService.onShowSnackbar({
                message: 'សូមចូលប្រព័ន្ធម្ដងទៀត',
                component: SnackbarComponent,
                isError: true
              });
              this.logout();
            } else {
              this.snackBarService.onShowSnackbar({
                message: 'សូមចូលប្រព័ន្ធម្ដងទៀត',
                component: SnackbarComponent,
                isError: true
              });
            }
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.onSmallScreen();
    this.breakpointObserver.observe([Breakpoints.Large]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.mobileQuery = false;
      }
    });

    this.onReloadData();
  }

  subscription;
  onReloadData() {
    // subscribe to the school service to reload logo when data is updated.
    this.subscription = this.userService.get().subscribe(res => {
      setTimeout(() => {
        this.account = res;
      }, 500);
    });
  }
  ngOnDestroy() {
    // this._sidenavService.sideNavState$.next();
    // this._sidenavService.sideNavState$.complete();
    this.subscription.unsubscribe();
  }

  initSidenav() {
    this.menu = [];
    for (let i = 0; i < this.menuAdmin.length; i++) {
      if (this.menuAdmin[i].child.length > 0) {
        let childs: ChildItem[] = [];
        for (let j = 0; j < this.menuAdmin[i]?.child.length; j++) {
          childs.push(this.menuAdmin[i].child[j]);
        }

        if (childs.length > 0) {
          let m: MenuItem = JSON.parse(JSON.stringify(this.menuAdmin[i]));
          m.child = JSON.parse(JSON.stringify(childs));
          this.menu.push(m);
        }
      } else {
        this.menu.push(this.menuAdmin[i]);
      }
    }
  }

  isChildActive(childs: MenuItem[] | ChildItem[]): boolean {
    for (let i = 0; i < childs.length; i++) {
      if (this.router.isActive(this.router.createUrlTree(childs[i].route), false)) {
        return true;
      }
    }
    return false;
  }

  onResize(): void {
    if (window.innerWidth <= 959) {
      this.mobileQuery = true;
      this.isExpanded = false;
    }
    if (window.innerWidth > 959 && window.innerWidth <= 1280) {
      this.isExpanded = false;
      this.mobileQuery = false;
    }
  }
  onSmallScreen(): void {
    if (window.innerWidth <= 959) {
      this.mobileQuery = true;
      this.isExpanded = false;
    }
    if (window.innerWidth > 959 && window.innerWidth <= 1280) {
      this.isExpanded = false;
      this.mobileQuery = false;
    }
  }

  toggleSideNav(): void {
    if (this.mobileQuery) {
      this.sidenav.toggle();
    } else {
      this.isExpanded = !this.isExpanded;
    }
  }

  logout(): void {
    this.isAuth = false;
    this.authSubscribe.unsubscribe();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
