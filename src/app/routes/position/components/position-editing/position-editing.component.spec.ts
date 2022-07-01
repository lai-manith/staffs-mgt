import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionEditingComponent } from './position-editing.component';

describe('PositionEditingComponent', () => {
  let component: PositionEditingComponent;
  let fixture: ComponentFixture<PositionEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionEditingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
