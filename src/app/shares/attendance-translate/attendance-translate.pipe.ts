import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendanceTranslate'
})
export class AttendanceTranslatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    let status: string;
    switch (value.toString()?.toLowerCase()) {
      case 'present':
        status = 'មក';
        break;

      case 'absent':
        status = 'អត់ច្បាប់';
        break;

      case 'permit':
        status = 'មានច្បាប់';
        break;

      case '1':
        status = 'ព្រឹក';
        break;

      case '2':
        status = 'ល្ងាច';
        break;

      default:
        break;
    }
    return status;
  }
}
