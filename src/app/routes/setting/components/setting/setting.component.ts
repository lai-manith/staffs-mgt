import { Component, OnInit } from '@angular/core';

export interface CardItem {
  svgIcon: string;
  title: string;
  route: string;
};

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  settings: CardItem[];
  academicItems: CardItem[];
  lmsItems: CardItem[];
  myInfo_route: string;
  staffId: string;
  account: any;

  constructor() { }

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('account'));
    this.settings = [
      { svgIcon: 'my-profile.svg', title: `My Profile`, route: 'manage-user/detail/' + this.account._id },
      { svgIcon: 'manage-user.svg', title: `Manage User`, route: 'manage-user' }
    ];
  }

}
