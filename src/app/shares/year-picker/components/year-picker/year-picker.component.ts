import { Component, Input, forwardRef, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
let moment;

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['year-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearPickerComponent),
      multi: true,
    },
  ],
})
export class YearPickerComponent implements ControlValueAccessor {
  @Input() _max: Date = new Date;
  @Output()
  selectedYear: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatDatepicker) _picker: MatDatepicker<Moment>;
  _inputCtrl: FormControl = new FormControl(this._max);
  date: Date = new Date();

  // Function to call when the date changes.
  onChange = (year: Date) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  writeValue(date: Date): void {
    if (date && this._isYearEnabled(date.getFullYear())) {
      const momentDate = moment(date);
      if (momentDate.isValid()) {
        this._inputCtrl.setValue(moment(date), { emitEvent: false });
      }
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this._picker.disabled = true : this._picker.disabled = false;
    isDisabled ? this._inputCtrl.disable() : this._inputCtrl.enable();
  }

  _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
    if (!this._isYearEnabled(chosenDate.year())) {
      datepicker.close();
      return;
    }

    this._inputCtrl.setValue(chosenDate, { emitEvent: false });
    this.onChange(chosenDate.toDate());
    this.selectedYear.emit(chosenDate.toDate());
    this.onTouched();
    datepicker.close();
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

  _openDatepickerOnFocus(datepicker: MatDatepicker<Moment>) {
    setTimeout(() => {
      if (!datepicker.opened) {
        datepicker.open();
      }
    });
  }

  private _isYearEnabled(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (year === undefined || year === null ||
      (this._max && year > this._max.getFullYear())
      // (this._min && year < this._min.getFullYear())
    ) {
      return false;
    }

    return true;
  }


  onPrevDate() {
    this._inputCtrl.setValue(new Date(new Date(this._inputCtrl.value).setFullYear(new Date(this._inputCtrl.value).getFullYear() - 1)));
    this.selectedYear.emit(this._inputCtrl.value);
  }

  onNextDate() {
    this._inputCtrl.setValue(new Date(new Date(this._inputCtrl.value).setFullYear(new Date(this._inputCtrl.value).getFullYear() + 1)));
    this.selectedYear.emit(this._inputCtrl.value);
  }

}
