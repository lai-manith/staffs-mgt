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
        path: 'position',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/position/position.module').then(m => m.PositionModule)
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
        path: 'setting',
        canActivate: [AuthGuard],
        loadChildren: () => import('./routes/user/user.module').then(m => m.UserModule)
      },
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
export class AppRoutingModule { }
