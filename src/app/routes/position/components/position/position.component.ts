import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { SearchFilter } from 'src/app/helpers/search-filter-behavior';
import { Position } from 'src/app/models/position';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Pagination } from 'src/app/shares/pagination/pagination';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends SearchFilter implements OnInit {
  displayedColumns: string[] = ['ID', 'title', 'title_en', 'description', '_id'];
  dataSource: MatTableDataSource<Position> = new MatTableDataSource([]);
  total: number = null;
  params = {
    page: 1,
    limit: 10,
    search: ''
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;

  constructor(private positionService: PositionService, private snackBarService: SnackbarService) {
    super();
  }

  ngOnInit() {
    this.onInitData();
  }

  onInitData(pagination?: Pagination) {
    this.setLoading(true);
    this.positionService.getMany({ ...this.params, ...this.filterParams, ...pagination }).pipe(takeUntil(this.unsubscribe$)).subscribe(
      res => {
        this.isLoading = true;
        this.dataSource = new MatTableDataSource(res.list);
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
