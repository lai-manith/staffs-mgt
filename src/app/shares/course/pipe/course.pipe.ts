import { Pipe, PipeTransform } from '@angular/core';
import { CourseEnum } from 'src/app/models/enums/admission.enum';

@Pipe({
  name: 'course'
})
export class CoursePipe implements PipeTransform {

  transform(value: unknown,): string {
    switch (value) {
      case CourseEnum.long_course:
        return "Long Course";
      case CourseEnum.short_course:
        return "Short Course";
      default:
        return '';
    }
  }

}
