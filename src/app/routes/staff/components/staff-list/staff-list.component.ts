import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  index: number;
  urlParam: string;
  constructor(private route: ActivatedRoute, private loadingService: LoadingService, private router: Router) {
    this.urlParam = this.route.snapshot.params.tab;
  }
  ngOnInit(): void {
    switch (this.urlParam) {
      case 'staff-list':
        this.index = 0;
        break;
      case 'staff-active':
        this.index = 1;
        break;
      case 'staff-inactive':
        this.index = 2;
        break;
        break;
      default:
        break;
    }
  }

  onIndexChange(event: number) {
    this.index = +event;
    switch (event) {
      case 0:
        this.urlParam = 'staff-list';
        break;
      case 1:
        this.urlParam = 'staff-active';
        break;
      case 2:
        this.urlParam = 'staff-inactive';
        break;
      default:
        break;
    }
    this.router.navigate(['/staff/', `${this.urlParam}`]);
  }
}
