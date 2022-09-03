import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Filter } from 'src/app/models/filter';
import { Staff } from 'src/app/models/staff';
import { CalendarService } from 'src/app/services/calendar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
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
export class StudentListDialogComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'name',
    'age',
    'gender',
    'position',
    'hire_date',
    'contact_expiry_date',
    'action',
  ];
  dataSource: MatTableDataSource<Staff> = new MatTableDataSource([]);;
  total: number;
  params = {
    page: 1,
    limit: 10,
    search: '',
    image_size: 150,
    status: true,
    gender: null,
    position: null,
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;
  images: string[];
  selectedFilterCount: number = 0;
  assignDataList: string[];
  selected: number = -1;

  filters: Filter[] = [
    {
      data: [
        {
          label: 'ទាំងអស់',
          value: null,
        },
      ],
      selectedIndex: 0,
      labelFunc: 'តំណែង',
      paramKey: 'position',
      matIcon: 'person',
    },
    {
      data: [
        {
          label: 'ទាំងអស់',
          value: null,
        },
        {
          label: 'ស្រី',
          value: 'female',
        },
        {
          label: 'ប្រុស',
          value: 'male',
        },
      ],
      selectedIndex: 0,
      labelFunc: 'ភេទ',
      paramKey: 'gender',
      matIcon: 'transgender',
    },
  ];

  constructor(
    private loadingService: LoadingService,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router,
    public dialogRef: MatDialogRef<StudentListDialogComponent>,
    private readonly calendarService: CalendarService,
    private staffService: StaffService,
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.onSetActiveFilter();
    this.onGetPosition();
  }

  onSetActiveFilter() {
    this.filters.forEach((element, i) => {
      this.filters[i].selectedValue = this.filters[i].data[0];
    });
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

  onLoad() {
    this.setLoading(true);
    this.staffService
      .getMany(this.params)
      .pipe(
        map(map => {
          for (let data of map.list) {
            data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          }
          return map;
        })
      )
      .subscribe(
        (res) => {
          this.dataSource = new MatTableDataSource(res.list);
          this.total = res.total;
          this.onCheckDataReload();
          this.setLoading(false);
        },
        (err) =>
          this.snackBarService.onShowSnackbar({
            message: err.error.message ?? err,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  onGetPosition() {
    const param = {
      page: 1,
      limit: 0,
      search: ''
    };
    this.positionService.getMany(param).subscribe(
      res => {
        res.list.forEach((element) => {
          this.filters[0].data.push({
            label: element.title,
            value: element._id,
          });
        });
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
    // this.assignDataList = [];
    // this.selectedDataList.forEach(element => {
    //   this.assignDataList.push(element._id);
    // });

    //if (this.assignDataList.length < 1) return;
    this.dialogRef.close({
      // staff: this.assignDataList.toString()
      staff: this.id
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

  onFilter(func, data) {
    switch (func) {
      case 1:
        this.params.gender = data.value;
        break;
      case 2:
        this.params.position = data.value;
        break;

      default:
        break;
    }

    this.params.page = 1;
    this.onLoad();
    this.selectedFilterCount = [
      this.params.gender,
      this.params.position,
    ].filter((fil) => fil || fil === false).length;
  }

  goTo(event) {
    this.params.limit = event.limit;
    this.params.page = event.page;
    this.isLoading = false;
    this.onLoad();
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
