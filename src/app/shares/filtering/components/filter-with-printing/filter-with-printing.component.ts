import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-with-printing',
  templateUrl: './filter-with-printing.component.html',
  styleUrls: ['./filter-with-printing.component.scss']
})
export class FilterWithPrintingComponent implements OnInit {

  @Output() queryEvent = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  search(value: string) {
    this.queryEvent.emit(value);
  }

  clear() {
    console.log('clear');

  }

}
