import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceHistoryRecordComponent } from './attendance-history-record.component';

describe('AttendanceHistoryRecordComponent', () => {
  let component: AttendanceHistoryRecordComponent;
  let fixture: ComponentFixture<AttendanceHistoryRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceHistoryRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceHistoryRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
