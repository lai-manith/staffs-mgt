import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondToMinute'
})
export class SecondToMinutePipe implements PipeTransform {
  transform(value: number): number | string {
    if (value && value > 0) return ((value / 60) % 1 === 0 ? value / 60 : (value / 60).toFixed(2)) + ' Minute';
    else return 'N/A';
  }
}
