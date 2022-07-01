import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionCreatingComponent } from './components/position-creating/position-creating.component';
import { PositionEditingComponent } from './components/position-editing/position-editing.component';
import { PositionComponent } from './components/position/position.component';

const routes: Routes = [
  {
    path: '',
    component: PositionComponent
  },
  {
    path: 'add-new',
    component: PositionCreatingComponent
  },
  {
    path: 'detail/:id',
    component: PositionEditingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule { }
