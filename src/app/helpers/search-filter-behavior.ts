import { Params } from '@angular/router';
import { Pagination } from '../shares/pagination/pagination';

export abstract class SearchFilter {
  protected filterParams: Params = {};
  protected params: Pagination = {
    limit: 10,
    page: 1,
    search: ''
  };

  abstract onInitData(pagination?: Pagination): void;

  setParams(filterParams: Params): void {
    if (Object.keys(filterParams).length < 1) this.filterParams = [];
    else this.filterParams = filterParams;

    this.startSearch();
  }

  //TODO: searching functions
  private timer: ReturnType<typeof setTimeout>;
  onSearch(value: string) {
    this.params.search = value;
    this.startSearch();
  }
  private startSearch() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onInitData(), 500);
  }

  goTo(pagination: Pagination) {
    this.onInitData(pagination);
  }
}
