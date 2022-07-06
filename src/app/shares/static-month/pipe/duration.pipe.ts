import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: string): string {
    if(value) {
      if (value.includes('months')) value = value.replace('months', 'ខែ');
      else value = value.replace('month', 'ខែ');
  
      if (value.includes('days')) value = value.replace('days', 'ថ្ងៃ');
      else value = value.replace('day', 'ថ្ងៃ');

      if (value.includes('years')) value = value.replace('years', 'ឆ្នាំ');
      else value = value.replace('year', 'ឆ្នាំ');
    }
    return value;
  }

}
