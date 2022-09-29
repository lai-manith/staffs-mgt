import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs';
import { SearchFilter } from 'src/app/helpers/search-filter-behavior';
import { Filter } from 'src/app/models/filter';
import { Staff } from 'src/app/models/staff';
import { CalendarService } from 'src/app/services/calendar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingService } from 'src/app/services/loading.service';
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
  selector: 'app-student-list-dialog',
  templateUrl: './student-list-dialog.component.html',
  styleUrls: ['./student-list-dialog.component.scss']
})
export class StudentListDialogComponent extends SearchFilter implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'name',
    'age',
    'gender',
    'position',
    'hire_date',
    'contact_expiry_date',
    'province',
    'action'
  ];
  dataSource: MatTableDataSource<Staff> = new MatTableDataSource([]);
  total: number;
  params = {
    page: 1,
    limit: 10,
    search: '',
    image_size: 150,
    status: true,
    gender: null,
    position: null
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;
  images: string[];
  selectedFilterCount: number = 0;
  assignDataList: string[];
  selected: number = -1;

  constructor(
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<StudentListDialogComponent>,
    public staffService: StaffService
  ) {
    super();
  }

  ngOnInit(): void {
    this.onInitData();
  }

  onInitData(pagination?: Pagination) {
    this.setLoading(true);
    this.staffService
      .getMany({ ...this.params, ...this.filterParams, ...pagination })
      .pipe(
        takeUntil(this.unsubscribe$),
        map(map => {
          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          }
          return map;
        })
      )
      .subscribe(
        res => {
          this.dataSource = new MatTableDataSource(res.list);
          this.total = res.total;
          this.onCheckDataReload();
          this.setLoading(false);
        },
        err =>
          this.snackBarService.onShowSnackbar({
            message: err.error.message ?? err,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  id: string;
  onChooseSchool(event, value) {
    if (event.checked) this.id = value._id;
    else this.id = null;
  }

  onSubmit() {
    this.assignDataList = [];
    this.selectedDataList.forEach(element => {
      this.assignDataList.push(element._id);
    });

    if (this.assignDataList.length < 1) return;
    this.dialogRef.close({
      staff: this.assignDataList.toString()
    });
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

  /**
   * TODO: be able to check multiple page
   */
  selectedDataList: Staff[] = [];
  totalDataSelected: number = 0;
  dataCheckedPerPage: Staff[];
  isCheckColumn: boolean = false;
  private isCheckRow: boolean = false;
  private totalDataNoToSchool: number = 0;

  onSelectDataRow(event: any, data: Staff) {
    if (event.checked) {
      this.selectedDataList.push(data);
    } else {
      this.selectedDataList = this.selectedDataList.filter(filter => filter._id != data._id);
      this.dataSource.data.filter(fil => fil._id === data._id).map(map => (map['is_check'] = false));
      this.isCheckRow = true;
    }
    this.totalDataSelected = this.selectedDataList.length;
    this.onCheckDataReload();
  }

  onCheckDataReload() {
    //*make sure data is still check even data is reloaded
    if (this.selectedDataList.length !== 0) {
      for (let data of this.dataSource.data) {
        for (let selected of this.selectedDataList) {
          if (data._id === selected._id) data['is_check'] = true;
        }
      }
    }

    //*show checked icon if data of current page is checked all
    this.dataCheckedPerPage = this.dataSource.data.filter(fil => fil.is_check);
    if (this.dataCheckedPerPage.length === this.dataSource.data.length) this.isCheckColumn = true;
    else this.isCheckColumn = false;
  }

  onSelectDataColumn() {
    if (this.dataSource) {
      this.isCheckColumn = !this.isCheckColumn;
      for (let data of this.dataSource.data) {
        if (this.isCheckColumn) {
          data['is_check'] = true;
          this.selectedDataList.push(data);
          this.onGetUniqueData();
        } else {
          data['is_check'] = false;
          this.selectedDataList = this.selectedDataList.filter(fil => fil._id !== data._id);
        }
      }
      this.onCheckDataReload();
      this.totalDataSelected = this.selectedDataList.length;
    }
  }

  onGetUniqueData() {
    this.selectedDataList = this.selectedDataList.reduce((unique, o) => {
      if (!unique.some(obj => obj._id === o._id)) {
        unique.push(o);
      }
      return unique;
    }, []);
  }
  /**
   * !End of be able to check multiple page
   */
}
