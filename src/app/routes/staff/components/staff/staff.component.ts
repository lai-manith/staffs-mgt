import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Filter } from 'src/app/models/filter';
import { Staff } from 'src/app/models/staff';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

interface Params {
  position?: string;
  gender?: string;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'name',
    'staff_id',
    'age',
    'gender',
    'position',
    'hire_date',
    'contract_expiry_date',
    'province',
    'status',
    '_id'
  ];
  dataSource: MatTableDataSource<Staff> = new MatTableDataSource([]);
  total: number;
  params = {
    page: 1,
    limit: 10,
    search: '',
    status: null,
    gender: null,
    position: null
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;

  filters: Filter[] = [
    {
      data: [
        {
          label: 'ទាំងអស់',
          value: null
        }
      ],
      selectedIndex: 0,
      labelFunc: 'តំណែង',
      paramKey: 'position',
      matIcon: 'person'
    },
    {
      data: [
        {
          label: 'ទាំងអស់',
          value: null
        },
        {
          label: 'ស្រី',
          value: 'female'
        },
        {
          label: 'ប្រុស',
          value: 'male'
        }
      ],
      selectedIndex: 0,
      labelFunc: 'ភេទ',
      paramKey: 'gender',
      matIcon: 'transgender'
    }
  ];
  images: string[];
  @Output() dataEvent: EventEmitter<Staff[]> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private snackBarService: SnackbarService,
    private readonly positionService: PositionService
  ) {}

  ngOnInit() {
    this.onSetActiveFilter();
    this.onGetPosition();

    if (this.router.url.includes('inactive')) this.params.status = false;
    else if (this.router.url.includes('active')) this.params.status = true;
  }

  onLoad() {
    this.setLoading(true);
    this.staffService
      .getAll(this.params)
      .pipe(
        map(map => {
          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
            data.status =
              data.status === true ? { name: 'សកម្ម', name_en: 'active' } : { name: 'អសកម្ម', name_en: 'inactive' };
          }
          return map;
        })
      )
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource(res.list);
          this.dataEvent.emit(res.list);
          this.total = res.total;
          this.setLoading(false);
        },
        err =>
          this.snackBarService.onShowSnackbar({
            message: err.message ?? err.error.message,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  onSetActiveFilter() {
    this.filters.forEach((element, i) => {
      this.filters[i].selectedValue = this.filters[i].data[0];
    });
  }

  onGetPosition() {
    const param = {
      page: 1,
      limit: 0,
      search: ''
    };
    this.positionService.getMany(param).subscribe(
      res => {
        res.list.forEach(element => {
          this.filters[0].data.push({
            label: element.title,
            value: element._id
          });
        });
      },
      err =>
        this.snackBarService.onShowSnackbar({
          message: err.message ?? err.error.message,
          component: SnackbarComponent,
          isError: true
        })
    );
  }

  onCreate() {
    this.router.navigate(['create-new'], { relativeTo: this.route });
  }

  setParams(paramObj: Params): void {
    this.params.page = 1;
    this.params = { ...this.params, ...paramObj };
    if (Object.entries(paramObj).length < 1) {
      this.onSetActiveFilter();
      delete this.params.position;
      delete this.params.gender;
    }
    this.onLoad();
  }

  goTo(event) {
    this.params.limit = event.limit;
    this.params.page = event.page;
    this.setLoading(false);
    this.onLoad();
  }

  onUpdateUser(id) {}

  onDeleteUser(id: string) {
    this.staffService.delete(id).subscribe(
      res => {
        this.onLoad();
      },
      err => {}
    );
  }

  onCreateNew(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  private setLoading(isLoading: boolean): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    let delayTime = 300;
    if (!isLoading) {
      delayTime = 0;
    }
    this.loadingTimeout = setTimeout(() => {
      this.isLoading = isLoading;
      this.loadingTimeout = null;
    }, delayTime);
  }

  //TODO: searching functions
  timer: ReturnType<typeof setTimeout>;
  onSearch(value: string) {
    this.params.search = value;
    this.params.page = 1;
    this.startSearch();
  }
  startSearch() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onLoad(), 500);
  }
}
