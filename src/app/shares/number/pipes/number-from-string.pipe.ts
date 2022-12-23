import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFromString'
})
export class NumberFromStringPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\D/g, '');
  }
}
