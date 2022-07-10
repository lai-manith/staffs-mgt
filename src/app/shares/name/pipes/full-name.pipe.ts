import { Pipe, PipeTransform } from '@angular/core';
import { Staff } from 'src/app/models/staff';
import { User } from 'src/app/models/user';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {
  transform(user: Staff | User): string {
    let names = [];
    if (user === undefined) return '';

    if (user.first_name) {
      names.push(user.first_name);
    }
    if (user.last_name) {
      names.push(user.last_name);
    }
    return names.join(' ');
  }

  // transform(value: User | User[], id: string = ''): string {
  //   if (value) {
  //     let user: User | undefined;
  //     if (Array.isArray(value)) {
  //       user = (value as User[]).find(u => u._id == id);
  //     } else {
  //       user = value;
  //     }
  //     if (user) {
  //       let names = [];
  //       if (user.last_name) {
  //         names.push(user.last_name);
  //       }

  //       if (user.first_name) {
  //         names.push(user.first_name);
  //       }
  //       return names.join(' ');
  //     }
  //   }
  //   return '';
  // }
}
