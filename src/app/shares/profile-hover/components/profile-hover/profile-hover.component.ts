import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile-hover',
  templateUrl: './profile-hover.component.html',
  styleUrls: ['./profile-hover.component.scss'],
})
export class ProfileHoverComponent implements OnInit {
  @Input() data: any;
  account: User;
  @Output() deleteEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.account = JSON.parse(localStorage.getItem('account'));
  }

  onDeleteDayOff(id: string): void {
    this.deleteEvent.emit(id);
  }
}
