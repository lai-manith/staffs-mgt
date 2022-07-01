import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbSemesterComponent } from './tb-semester.component';

describe('TbSemesterComponent', () => {
  let component: TbSemesterComponent;
  let fixture: ComponentFixture<TbSemesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbSemesterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
