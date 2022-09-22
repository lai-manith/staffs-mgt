import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffProvinceByYearComponent } from './staff-province-by-year.component';

describe('StaffProvinceByYearComponent', () => {
  let component: StaffProvinceByYearComponent;
  let fixture: ComponentFixture<StaffProvinceByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffProvinceByYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffProvinceByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
