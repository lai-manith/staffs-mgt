/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxMinLength]'
})
export class MaxMinLengthDirective {
  @Input() appMaxMinLength: { max?: number; min?: number };

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onChange(event: KeyboardEvent) {
    this.onInputChange(event);
  }

  @HostListener('paste', ['$event']) onClick(event: ClipboardEvent) {
    this.onInputChange(event);
  }

  onInputChange(e: ClipboardEvent | KeyboardEvent): void {
    const functionalKeys = ['Backspace', 'ArrowRight', 'ArrowLeft'];
    let eventKey: KeyboardEvent = e as unknown as KeyboardEvent;
    let eventPaste: ClipboardEvent = e as unknown as ClipboardEvent;
    let input: HTMLInputElement = this.el.nativeElement;

    //avoid leaks value of typing backspace and arrows
    if (functionalKeys.indexOf(eventKey.key) !== -1) {
      return;
    }

    //validate can't type space key
    if (eventKey.which === 32) return e.preventDefault();

    //check value is not a number
    let keyValue: number = e instanceof ClipboardEvent ? +eventPaste.clipboardData?.getData('text') : +eventKey.key;
    if (isNaN(keyValue)) {
      return e.preventDefault();
    }

    //get value from input and it's length
    const hasSelection: boolean = input.selectionStart !== input.selectionEnd && input.selectionStart !== null;
    let newValue: string;
    if (hasSelection) {
      newValue = this.replaceSelection(input, eventKey.key);
    } else {
      newValue = input.value + keyValue.toString();
    }

    //check max and min values
    if (
      +newValue < this.appMaxMinLength?.min ||
      +newValue > this.appMaxMinLength?.max ||
      newValue.length > this.appMaxMinLength?.max?.toString()?.length
    ) {
      return e.preventDefault();
    }
  }

  private replaceSelection(input, key) {
    const inputValue: string = input.value;
    const start: number = input.selectionStart;
    const end: number = input.selectionEnd || input.selectionStart;

    return inputValue.substring(0, start) + key + inputValue.substring(end + 1);
  }
}
