import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPositionByYearComponent } from './staff-position-by-year.component';

describe('StaffPositionByYearComponent', () => {
  let component: StaffPositionByYearComponent;
  let fixture: ComponentFixture<StaffPositionByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffPositionByYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffPositionByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
