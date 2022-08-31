import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartReportComponent } from './bar-chart-report.component';

describe('BarChartReportComponent', () => {
  let component: BarChartReportComponent;
  let fixture: ComponentFixture<BarChartReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
