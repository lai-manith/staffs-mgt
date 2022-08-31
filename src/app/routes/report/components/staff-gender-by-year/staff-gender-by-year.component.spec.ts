import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffGenderByYearComponent } from './staff-gender-by-year.component';

describe('StaffGenderByYearComponent', () => {
  let component: StaffGenderByYearComponent;
  let fixture: ComponentFixture<StaffGenderByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffGenderByYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffGenderByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
