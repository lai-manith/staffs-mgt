import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCreatingComponent } from './staff-creating.component';

describe('StaffCreatingComponent', () => {
  let component: StaffCreatingComponent;
  let fixture: ComponentFixture<StaffCreatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffCreatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
