import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { StaffCreatingComponent } from '../staff/components/staff-creating/staff-creating.component';
import { StaffEditingComponent } from '../staff/components/staff-editing/staff-editing.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  {
    path: 'detail/:id',
    canActivate: [AuthGuard],
    component: StaffEditingComponent
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: StaffCreatingComponent
  },
  {
    path: 'detail/:id/edit',
    canActivate: [AuthGuard],
    component: StaffCreatingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
