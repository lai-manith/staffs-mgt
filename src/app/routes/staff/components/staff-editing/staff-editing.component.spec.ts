import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffEditingComponent } from './staff-editing.component';

describe('StaffEditingComponent', () => {
  let component: StaffEditingComponent;
  let fixture: ComponentFixture<StaffEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffEditingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
