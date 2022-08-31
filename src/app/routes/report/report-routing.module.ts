import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffGenderByYearComponent } from './components/staff-gender-by-year/staff-gender-by-year.component';

const routes: Routes = [
  {
    path: '',
    component: StaffGenderByYearComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
