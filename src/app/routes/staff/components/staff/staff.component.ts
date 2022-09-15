import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SearchFilter } from 'src/app/helpers/search-filter-behavior';
import { CityProvinces } from 'src/app/models/address';
import { Filter } from 'src/app/models/filter';
import { Staff } from 'src/app/models/staff';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { Pagination } from 'src/app/shares/pagination/pagination';
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
export class StaffComponent extends SearchFilter implements OnInit {
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
  images: string[];
  provinces: { label: string; value: string }[];
  @Output() dataEvent: EventEmitter<Staff[]> = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public staffService: StaffService,
    private snackBarService: SnackbarService,
    private readonly positionService: PositionService
  ) {
    super();
  }

  ngOnInit() {
    this.onInitData();

    if (this.router.url.includes('inactive')) this.params.status = false;
    else if (this.router.url.includes('active')) this.params.status = true;
  }

  onInitData(pagination?: Pagination) {
    this.setLoading(true);
    this.staffService
      .getAll({ ...this.params, ...this.filterParams, ...pagination })
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
          this.total = res.total;
          this.dataEvent.emit(res.list);
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

  onCreate() {
    this.router.navigate(['create-new'], { relativeTo: this.route });
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
}
