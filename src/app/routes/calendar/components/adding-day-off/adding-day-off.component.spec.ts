import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingDayOffComponent } from './adding-day-off.component';

describe('AddingDayOffComponent', () => {
  let component: AddingDayOffComponent;
  let fixture: ComponentFixture<AddingDayOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingDayOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingDayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
