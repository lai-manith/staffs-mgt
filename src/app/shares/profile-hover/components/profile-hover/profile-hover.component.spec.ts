import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHoverComponent } from './profile-hover.component';

describe('ProfileHoverComponent', () => {
  let component: ProfileHoverComponent;
  let fixture: ComponentFixture<ProfileHoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileHoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
