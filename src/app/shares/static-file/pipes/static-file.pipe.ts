import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'staticFile'
})
export class StaticFilePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      return environment.file_static_url + value;
    }
    return null;
  }
}
