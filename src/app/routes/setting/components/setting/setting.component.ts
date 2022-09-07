import { Component, OnInit } from '@angular/core';

export interface CardItem {
  svgIcon: string;
  title: string;
  route: string;
}

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

  constructor() {}

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('account'));
    this.settings = [
      { svgIcon: 'my-profile.svg', title: `ព័ត៌មានរបស់ខ្ញុំ`, route: 'manage-user/detail/' + this.account._id },
      { svgIcon: 'staff.svg', title: `អ្នកគ្រប់គ្រង`, route: 'manage-user' },
      { svgIcon: 'manage-title.svg', title: `តំណែង`, route: 'manage-position' }
    ];
  }
}
