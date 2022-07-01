import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterWithoutCreateNewComponent } from './filter-without-create-new.component';

describe('FilterWithoutCreateNewComponent', () => {
  let component: FilterWithoutCreateNewComponent;
  let fixture: ComponentFixture<FilterWithoutCreateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterWithoutCreateNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterWithoutCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
