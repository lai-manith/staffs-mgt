import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { StaffGenderByYearComponent } from './components/staff-gender-by-year/staff-gender-by-year.component';
import { StaffPositionByYearComponent } from './components/staff-position-by-year/staff-position-by-year.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'gender',
    pathMatch: 'full'
  },
  {
    path: 'gender',
    canActivate: [AuthGuard],
    component: StaffGenderByYearComponent
  },
  {
    path: 'position',
    canActivate: [AuthGuard],
    component: StaffPositionByYearComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
