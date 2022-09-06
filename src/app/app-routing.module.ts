import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContainerComponent } from './components/container/container.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'staff',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/staff/staff.module').then(m => m.StaffModule)
      },
      {
        path: 'calendar',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/calendar/calendar.module').then(m => m.CalendarModule)
      },
      {
        path: 'attendance',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/attendance/attendance.module').then(m => m.AttendanceModule)
      },
      {
        path: 'setting',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: 'report',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/report/report.module').then(m => m.ReportModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./routes/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
