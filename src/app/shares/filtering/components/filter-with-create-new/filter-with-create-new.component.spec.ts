import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterWithCreateNewComponent } from './filter-with-create-new.component';

describe('FilterWithCreateNewComponent', () => {
  let component: FilterWithCreateNewComponent;
  let fixture: ComponentFixture<FilterWithCreateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterWithCreateNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterWithCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
