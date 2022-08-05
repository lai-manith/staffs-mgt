import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceHistoryComponent } from './components/attendance-history/attendance-history.component';
import { AttendanceComponent } from './components/attendance/attendance.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent
  },
  {
    path: 'history',
    component: AttendanceHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
