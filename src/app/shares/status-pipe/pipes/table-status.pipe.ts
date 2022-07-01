import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableStatus'
})
export class TableStatusPipe implements PipeTransform {

  transform(status: number): string {
    let statusString: string = '';

    if (!status) return '';
    switch (status) {
      case 1:
        statusString = 'Active';
        break;
      case -1:
        statusString = 'Inactive';
        break;
      default:
        statusString = statusString;
        break;
    }
    return statusString;
  }

}
