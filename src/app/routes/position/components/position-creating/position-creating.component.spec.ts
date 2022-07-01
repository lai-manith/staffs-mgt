import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionCreatingComponent } from './position-creating.component';

describe('PositionCreatingComponent', () => {
  let component: PositionCreatingComponent;
  let fixture: ComponentFixture<PositionCreatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionCreatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
