import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['ID', 'name', 'username', 'dob', 'gender', 'email', 'status', '_id'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);
  total: number;
  params = {
    page: 1,
    limit: 10,
    search: '',
    image_size: 150,
  };

  optionStatus = [
    {
      value: null,
      viewValue: 'ទាំងអស់'
    },
  ]
  selectedStatus = this.optionStatus[0];
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackbarService: SnackbarService,
    ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.setLoading(true);
    this.userService.getAll(this.params)
    .pipe(
      map(map => {
        for(let data of map.list) {
          data.gender = data.gender === 'male' ? 'ប្រុស' : 'ស្រី';
          data.status = data.status === true ? {name: 'សកម្ម' ,name_en: 'active'} : {name: 'អសកម្ម' ,name_en: 'inactive'};
        }
        return map;
      })
    )
    .subscribe(
      res => {
        this.setLoading(false);
        this.dataSource = new MatTableDataSource(res.list);
        this.total = res.total;
      },
      err => this.snackbarService.onShowSnackbar({message: err.error.message ?? err, isError: true, component: SnackbarComponent})

    )
  }

  onUpdateUser(id) {
  }

  onFilter(value) {
    this.params.page = 1;
    this.onLoad();
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

  goTo(event: any) {
    this.params.limit = event.limit;
    this.params.page = event.page;
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
