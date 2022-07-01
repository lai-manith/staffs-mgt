import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterWithPrintingComponent } from './filter-with-printing.component';

describe('FilterWithPrintingComponent', () => {
  let component: FilterWithPrintingComponent;
  let fixture: ComponentFixture<FilterWithPrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterWithPrintingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterWithPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
