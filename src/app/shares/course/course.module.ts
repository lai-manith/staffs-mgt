import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursePipe } from './pipe/course.pipe';



@NgModule({
  declarations: [
    CoursePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [CoursePipe]
})
export class CourseModule { }
