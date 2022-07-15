import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './components/setting/setting.component';
import { MatCardModule } from "@angular/material/card";


@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MatCardModule
  ]
})
export class SettingModule { }
