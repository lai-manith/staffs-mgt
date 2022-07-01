import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSalaryDialogComponent } from './staff-salary-dialog.component';

describe('StaffSalaryDialogComponent', () => {
  let component: StaffSalaryDialogComponent;
  let fixture: ComponentFixture<StaffSalaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffSalaryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffSalaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
