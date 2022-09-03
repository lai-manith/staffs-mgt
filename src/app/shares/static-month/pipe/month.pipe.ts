import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'khmerMonth'
})
export class MonthPipe implements PipeTransform {

  transform(value: string | Date | number): string {

    const khmerMonthList = [
      { value: 1, name: 'មករា'},
      { value: 2, name: 'កុម្ភៈ'},
      { value: 3, name: 'មីនា'},
      { value: 4, name: 'មេសា'},
      { value: 5, name: 'ឧសភា'},
      { value: 6, name: 'មិថុនា'},
      { value: 7, name: 'កក្កដា'},
      { value: 8, name: 'សីហា'},
      { value: 9, name: 'កញ្ញា'},
      { value: 10, name: 'តុលា'},
      { value: 11, name: 'វិច្ឆកា'},
      { value: 12, name: 'ធ្នូ' }
    ];

    const date = new Date(value)
    const month = date.getMonth() + 1;
    let str: string = '';

    for(let i: number = 0; i < khmerMonthList.length; i++){
      if(khmerMonthList[i].value === month) {
        str = khmerMonthList[i].name;
        return str;
      }
    }

  }

}
