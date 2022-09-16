import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneSpace'
})
export class PhoneSpacePipe implements PipeTransform {

    transform(phone: string): string {
        let phone_number: string = '';
        if(phone){
            phone_number = phone.match(/\d{3}/g).join(" ")
        }
        return phone_number;
    }

}