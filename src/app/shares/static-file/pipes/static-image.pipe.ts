import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staticImage'
})
export class StaticImagePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      if (value.includes('size=m')) value = value.replace('size=m', '256x0/');
      else value = value.replace('size=s', '64x0/');
      return 'https://d3tlbvlizvc34n.cloudfront.net/fit-in/' + value;
    }
    return null;
  }
}
