import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar-in-select-option',
  templateUrl: './searchbar-in-select-option.component.html',
  styleUrls: ['./searchbar-in-select-option.component.scss']
})
export class SearchbarInSelectOptionComponent implements OnInit {
  @Output() createNew: EventEmitter<any> = new EventEmitter();
  @Output() queryEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  search(value: string) {
    this.queryEvent.emit(value);
  }

  clear() {
    this.queryEvent.emit('');
  }
}
