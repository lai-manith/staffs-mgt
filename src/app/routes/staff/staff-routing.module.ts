import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { StaffAttendanceComponent } from './components/staff-attendance/staff-attendance.component';
import { StaffContractComponent } from './components/staff-contract/staff-contract.component';
import { StaffCreatingComponent } from './components/staff-creating/staff-creating.component';
import { StaffEditingComponent } from './components/staff-editing/staff-editing.component';
import { StaffListComponent } from './components/staff-list/staff-list.component';
import { StaffSalaryComponent } from './components/staff-salary/staff-salary.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'staff-active',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: StaffCreatingComponent
  },
  {
    path: ':tab',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: StaffListComponent
      },
      {
        path: 'detail/:id',
        canActivate: [AuthGuard],
        component: StaffEditingComponent
      },
      {
        path: 'manage-salary/:id',
        canActivate: [AuthGuard],
        component: StaffSalaryComponent
      },
      {
        path: 'manage-contact/:id',
        canActivate: [AuthGuard],
        component: StaffContractComponent
      },
      {
        path: 'manage-attendant-year/:id',
        canActivate: [AuthGuard],
        component: StaffAttendanceComponent
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
