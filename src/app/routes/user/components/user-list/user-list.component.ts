import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SearchFilter } from 'src/app/helpers/search-filter-behavior';
import { User } from 'src/app/models/user';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { Pagination } from 'src/app/shares/pagination/pagination';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends SearchFilter implements OnInit {
  displayedColumns: string[] = ['ID', 'name', 'username', 'dob', 'gender', 'email', 'status', '_id'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);
  total: number;
  params = {
    page: 1,
    limit: 10,
    search: ''
  };

  optionStatus = [
    {
      value: null,
      viewValue: 'ទាំងអស់'
    }
  ];
  selectedStatus = this.optionStatus[0];
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;

  constructor(private userService: UserService, private snackbarService: SnackbarService) {
    super();
  }

  ngOnInit() {
    this.onInitData();
  }

  onInitData(pagination?: Pagination): void {
    this.setLoading(true);
    this.userService
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
          this.setLoading(false);
          this.dataSource = new MatTableDataSource(res.list);
          this.total = res.total;
        },
        err =>
          this.snackbarService.onShowSnackbar({
            message: err.error.message ?? err,
            isError: true,
            component: SnackbarComponent
          })
      );
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
