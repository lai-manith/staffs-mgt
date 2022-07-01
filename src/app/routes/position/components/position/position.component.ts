import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Position } from 'src/app/models/position';
import { PositionService } from 'src/app/services/position.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'title', 'title_en', 'description', '_id'];
  dataSource: MatTableDataSource<Position> = new MatTableDataSource([]);
  total: number = null;
  params = {
    page: 1,
    limit: 10,
    search: '',
    image_size: 150,
    status: null
  };
  isLoading: boolean = true;
  loadingTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private positionService: PositionService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.setLoading(true);
    this.positionService
      .getMany(this.params)
      // .pipe(
      //   map(map => {
      //     return map;
      //   })
      // )
      .subscribe(
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
