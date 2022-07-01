import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreatingComponent } from './components/user-creating/user-creating.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserEditingComponent } from './components/user-editing/user-editing.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'add-new',
    component: UserCreatingComponent
  },
  {
    path: 'detail/:id',
    component: UserDetailComponent
  },
  {
    path: 'detail/:id/edit',
    component: UserEditingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
