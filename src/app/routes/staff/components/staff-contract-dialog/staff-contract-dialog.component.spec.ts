import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffContractDialogComponent } from './staff-contract-dialog.component';

describe('StaffContractDialogComponent', () => {
  let component: StaffContractDialogComponent;
  let fixture: ComponentFixture<StaffContractDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffContractDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffContractDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
