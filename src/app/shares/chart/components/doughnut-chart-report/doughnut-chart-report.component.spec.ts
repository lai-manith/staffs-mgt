import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutChartReportComponent } from './doughnut-chart-report.component';

describe('DoughnutChartReportComponent', () => {
  let component: DoughnutChartReportComponent;
  let fixture: ComponentFixture<DoughnutChartReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoughnutChartReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutChartReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
