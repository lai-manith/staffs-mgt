import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Filter, Option, OptionParam } from 'src/app/models/filter';

@Component({
  selector: 'app-filter-without-create-new',
  templateUrl: './filter-without-create-new.component.html',
  styleUrls: ['./filter-without-create-new.component.scss']
})
export class FilterWithoutCreateNewComponent {
  @Input() filters: Filter[] = [];
  previousFilters: number[] = [];
  @Input() title: string = '';
  @Input() hide: string = null;
  @Output() queryEvent = new EventEmitter<string>();
  @Output() queryFilter = new EventEmitter<any>();
  filterSet = new Set();
  showFilter: boolean;
  @ViewChild('select') select: MatSelect;
  private params: any = {};
  viewDate: Date = new Date();

  search(value: string) {
    this.queryEvent.emit(value);
  }

  clear() {
    this.queryEvent.emit('');
  }

  onFilter(func: any, valueObj: any) {
    this.countFilter(func, valueObj);
    const filter: OptionParam = {
      labelParam: func.labelFunc,
      value: valueObj.value,
      paramKey: func.paramKey
    };
    this.params[filter.paramKey] = filter.value;
    this.queryFilter.emit(this.params);
  }

  countFilter(func: string, valueObj: OptionParam): void {
    if (func && valueObj.value && !this.filterSet.has(func)) {
      this.filterSet.add(func);
    }
    if (!valueObj.value) {
      this.filterSet.delete(func);
    }
  }

  reset(): void {
    this.filters.forEach(filter => (filter.selectedValue = null));
    this.filterSet.clear();
    this.params = {};
    this.queryFilter.emit(this.params);
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('fired');
  }
  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    if (this.previousFilters.length == 0) {
      this.filters.forEach(filter => {
        this.previousFilters.push(filter.data.length);
      });
    }
    const noChangeData = this.filters.every((filter, index) => filter.data.length === this.previousFilters[index]);

    if (!noChangeData) {
      const changedFilter = this.filters.find((filter, index) => filter.data.length !== this.previousFilters[index]);
      this.params[changedFilter.paramKey] = null;
      this.queryFilter.emit(this.params);
      this.previousFilters = [];
      this.filters.forEach(filter => {
        this.previousFilters.push(filter.data.length);
      });
    }
  }

  onDateChange(value?: Date): void {
    console.log(value);
  }
}
