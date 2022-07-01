import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToTimeAgo'
})
export class DateToTimeAgoPipe implements PipeTransform {

  transform(date: string): string {
    if (!date) { return 'a long time ago'; }
    let time = (Date.now() - Date.parse(date)) / 1000;
    if (time < 10) {
      return 'ឥឡូវនេះ';
    } else if (time < 60) {
      return 'អម្បិញមិញ';
    }
    const divider = [60, 60, 24, 30, 12];
    const string = [' វិនាទី', ' នាទី', ' ម៉ោង', ' ថ្ងៃ', ' ខែ', ' ឆ្នាំ'];
    let i;
    for (i = 0; Math.floor(time / divider[i]) > 0; i++) {
      time /= divider[i];
    }
    return Math.floor(time) + string[i] + 'មុន';
  }

}
