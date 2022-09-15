import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { Filter, Option, OptionParam, useFilter } from 'src/app/models/filter';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import EnumConstant, { UserStatusEnum } from 'src/app/models/enums/enumConstant';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { StaffService } from 'src/app/services/staff.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private staffService: StaffService,
    private positionService: PositionService
  ) {
    this.currentUrl = router.url;
  }

  @ViewChild('subjects') subjects: MatSelectionList;
  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;
  @ViewChild('select') select: MatSelect;
  @ViewChild('searchQuery') searchQuery: ElementRef;

  @Input() hide?: string[] = ['dateRange', 'date'];
  @Input() useFilters: useFilter[] = [];
  @Input() title: string = '';
  @Input() passingFilters: Partial<Filter>[] = []; // this filter is passing from their component
  @Input() titleFilter: string = 'Subject';
  @Input() hasButton: boolean = false;
  @Input() button: { label?: string; svgIcon?: string; matIcon?: string } = {
    label: 'បង្កើតថ្មី',
    matIcon: '',
    svgIcon: 'add_new'
  };
  @Input() apiRoute: Observable<any> = null;
  @Input() maxDate;
  @Input() passingQueryParams: Filter[] = []; // this query params is passing from their component

  @Output() queryEvent = new EventEmitter<string>();
  @Output() queryFilter = new EventEmitter<any>();
  @Output() actionButton: EventEmitter<any> = new EventEmitter();
  @Output() dateRangeEvent = new EventEmitter<any>();
  @Output() dateEvent = new EventEmitter<any>();

  date: Date = new Date();
  firstDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  start_date = new FormControl(this.firstDate);
  end_date = new FormControl(this.lastDate);
  dateNow = new FormControl(this.date);

  private params: any = {};
  userStatusEnum = UserStatusEnum;
  selectedSubjects: { value: string; label: string }[] = [];
  subjectOptions: any;
  previousFilters: number[] = [];
  filterSet = new Set();
  showFilter: boolean;
  total: number = 0;
  faslsy: boolean[] = [];

  filters: Filter[] = [
    {
      title: 'ស្ថានភាព',
      use: false,
      data: [
        {
          value: null,
          label: 'ទាំងអស់'
        },
        {
          value: 'true',
          label: 'សកម្ម'
        },
        {
          value: 'false',
          label: 'អសកម្ម'
        }
      ],
      labelFunc: 'status',
      paramKey: 'status',
      svgIcon: 'status'
    },
    {
      title: 'ភេទ',
      use: false,
      data: [
        {
          value: null,
          label: 'ទាំងអស់'
        },
        {
          value: 'female',
          label: 'ស្រី'
        },
        {
          value: 'male',
          label: 'ប្រុស'
        }
      ],
      labelFunc: 'gender',
      paramKey: 'gender',
      svgIcon: 'gender'
    },
    {
      title: 'ប្រភេទវត្តមាន',
      use: false,
      data: [
        {
          value: null,
          label: 'ទាំងអស់'
        },
        {
          value: 1,
          label: 'មក'
        },
        {
          value: 2,
          label: 'អត់ច្បាប់'
        },
        {
          value: 3,
          label: 'មានច្បាប់'
        }
      ],
      labelFunc: 'attendance',
      paramKey: 'attendance_type',
      svgIcon: 'attendance_type'
    },
    {
      title: 'វេន',
      use: false,
      data: [
        {
          value: null,
          label: 'ទាំងអស់'
        },
        {
          value: 1,
          label: 'ព្រឹក'
        },
        {
          value: 2,
          label: 'ថ្ងៃ'
        }
      ],
      labelFunc: 'shift',
      paramKey: 'shift_type',
      svgIcon: 'shift_type'
    },
    {
      title: 'តំណែង',
      use: false,
      data: [
        {
          value: null,
          label: 'ទាំងអស់'
        }
      ],
      labelFunc: 'position',
      paramKey: 'position',
      svgIcon: 'position'
    }
  ];
  searchSubscription: Subscription;
  currentUrl: string;

  ngOnInit(): void {
    this.renderFilter();
  }

  ngAfterViewInit(): void {
    this.scroller
      ?.elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 96),
        throttleTime(50)
      )
      .subscribe(() => {
        this.recheck();
      });
  }

  onDateRageChange(value: Date): void {
    if (value) {
      this.dateRangeEvent.emit({
        start_date: formatDate(this.start_date.value, 'yyyy-MM-dd', 'en-Us'),
        end_date: formatDate(this.end_date.value, 'yyyy-MM-dd', 'en-Us')
      });
    }
  }

  onDateChange(value: Date): void {
    this.dateEvent.emit(value);
  }

  @ViewChild('filter') matMenu: MatMenuTrigger;
  filterClick(): void {
    if (this.useFilters.length < 1 && this.faslsy.every(stat => stat === true)) {
      this.matMenu.closeMenu();
    }
  }

  isFalseAll(element, index, array) {
    return element === false;
  }

  search(value: string) {
    this.queryEvent.emit(value);
  }

  onButtonAction() {
    this.actionButton.emit(null);
  }

  clear() {
    this.queryEvent.emit('');
  }

  onFilter(func: any, valueObj: any) {
    this.countFilter(func.paramKey, valueObj.value);
    const filter: OptionParam = {
      labelParam: func.labelFunc,
      value: valueObj.value,
      paramKey: func.paramKey
    };

    this.params[filter.paramKey] = filter.value;
    this.queryFilter.emit(this.params);
  }

  countFilter(paramKey: useFilter, hasValue: boolean): void {
    if (paramKey && hasValue && !this.filterSet.has(paramKey)) {
      this.filterSet.add(paramKey);
    }
    if (!hasValue) {
      this.filterSet.delete(paramKey);
    }
  }

  reset(): void {
    this.filters.forEach(filter => {
      filter.selectedValue = null;
    });
    this.selectedSubjects = [];
    this.subjects?.deselectAll();
    this.filterSet.clear();
    this.params = {};
    this.queryFilter.emit(this.params);
  }

  renderFilter(): void {
    /**
     * map passing filter with filter by param key
     */
    const useFilterKeys: useFilter[] = [];
    this.passingFilters.forEach(pFilter =>
      this.filters.forEach(filter => {
        if (pFilter.paramKey === filter.paramKey) {
          filter.data = pFilter.data;
          filter.dep = pFilter.dep;
          useFilterKeys.push(filter.paramKey);
        }
      })
    );
    /** End */

    /**
     * map passing query params with filters by param key
     * then call onFilter func
     */

    if (this.passingQueryParams?.length > 0) {
      this.passingQueryParams.map(query => {
        this.filters.map(filter => {
          if (filter.paramKey === query.paramKey) {
            const data: Option = Object.assign({}, ...query.data);
            filter.selectedValue = data.value;
            const valueObj: any = filter.selectedValue;
            this.onFilter(filter, valueObj);
          }
        });
      });
    }
    /** End */

    this.useFilters.forEach(filterName => {
      const foundFilter = this.filters.find(filter => filter.paramKey.toLowerCase() === filterName);
      foundFilter.use = true;
    });

    if (this.useFilters.includes('position')) {
      this.getPosition();
    }

    //Concat new Filter from API
    this.onMergeNewFilter();
  }

  onMergeNewFilter(): void {
    if (this.apiRoute) {
      this.faslsy = [];
      this.apiRoute.subscribe(data => {
        for (const item in data) {
          this.faslsy.push(
            Object.values(data[item]).every((value: any) => {
              if (!value || value.length < 1) {
                return true;
              }
              return false;
            })
          );

          data[item] = [{ label: 'ទាំងអស់', value: null }].concat(
            data[item].map(map => {
              this.arrayFilter.push({
                label: map?.name ?? map._id ?? map,
                value: map._id ?? map,
                key: item
              });
              return {
                label: map?.name ?? map._id ?? map,
                value: map._id ?? map
              };
            })
          );

          this.filters.push({
            title: item.replace('_', ' ') === 'city provinces' ? 'កន្លែងកំណើត' : item.replace('_', ' '),
            use: true,
            data: data[item],
            labelFunc: item,
            paramKey: item as any,
            svgIcon: item,
            hasSearch: item === 'academic_programs' || item === 'programs' || item === 'generations' ? true : false
          });
        }
      });
    }
  }

  onCollapse(): void {
    this.searchQuery = null;
  }

  arrayFilter: any[] = [];
  onSearch(searchQuery: string, key: string): void {
    const filter = searchQuery.toLowerCase();
    for (const iterator of this.filters) {
      if (iterator.paramKey === key) {
        const newData = this.arrayFilter.filter(
          (option: any) => option.label.toString().toLowerCase().includes(filter.toLowerCase()) && key === option.key
        );
        if (newData.length > 0) {
          iterator.data = [{ label: 'ទាំងអស់', value: null }].concat(newData);
        } else iterator.data = newData;
      }
    }
  }

  getPosition(): void {
    this.positionService.getMany({ page: 1, limit: 0, search: '' }).subscribe(data => {
      let classList = data.list as any as {
        label: string;
        value: number | string | null;
        key: string;
      }[];
      classList = classList.map((item: any) => ({
        label: item.name ?? item.title,
        value: item._id,
        key: 'position'
      }));
      const filter = this.filters.find((item: any) => item.paramKey === 'position');
      filter.data = [{ label: 'ទាំងអស់', value: null }].concat(classList);
      this.arrayFilter = this.arrayFilter.concat(filter.data);
    });
  }

  remove(item: { value: string; label: string }, paramKey: useFilter): void {
    const itemId = item.value;
    const foundItem = this.selectedSubjects.find(item => item.value === itemId);
    const index = this.selectedSubjects.indexOf(foundItem);
    const filter = this.subjects?.options.find(option => option.value.value === item.value);
    filter.selected = false;
    this.selectedSubjects.splice(index, 1);
    this.params[paramKey] = this.selectedSubjects.map(subject => subject.value);
    this.countFilter(paramKey, this.params[paramKey].length);
    this.queryFilter.emit(this.params);
  }

  searchSubject(searchQuery: string): void {
    const filter = searchQuery.toLowerCase();
    const subjectFilterObj = this.filters.find((item: any) => item.paramKey === 'subjects');
    subjectFilterObj.data = this.subjectOptions.filter((option: any) => option.label.toLowerCase().includes(filter));
    this.cdr.detectChanges();
    const filters = this.subjects?.options.filter(option =>
      this.selectedSubjects.some(subject => subject.value === option.value.value)
    );
    this.subjects?.selectedOptions.select(...filters);
  }

  onSelectionChanges(event: MatSelectionListChange, paramKey: useFilter): void {
    const idx = this.selectedSubjects.findIndex(selection => selection.value === event.options[0].value.value);
    if (event.options[0].selected && idx === -1) {
      this.selectedSubjects.push(event.options[0].value);
    }
    if (!event.options[0].selected && idx !== -1) {
      this.selectedSubjects.splice(idx, 1);
    }
    this.params[paramKey] = this.selectedSubjects.map(subject => subject.value);
    this.countFilter(paramKey, this.params[paramKey].length);
    this.queryFilter.emit(this.params);
  }

  recheck(): void {
    const filters = this.subjects?.options.filter(option =>
      this.selectedSubjects.some(subject => subject.value === option.value.value)
    );
    this.subjects?.selectedOptions.select(...filters);
  }

  getFilterByKey(key: string): Filter {
    return this.filters.find(filter => filter.paramKey === key);
  }

  ngOnChanges(_: SimpleChanges): void {
    this.passingFilters.forEach(pFilter =>
      this.filters.forEach(filter => {
        if (pFilter.paramKey === filter.paramKey) {
          filter.data = pFilter.data;
          filter.dep = pFilter.dep;
        }
      })
    );
  }
}
