import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatingComponent } from './user-creating.component';

describe('UserCreatingComponent', () => {
  let component: UserCreatingComponent;
  let fixture: ComponentFixture<UserCreatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
