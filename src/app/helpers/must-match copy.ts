import { FormGroup, ValidatorFn } from '@angular/forms';

export function MustMatch(new_password: string, confirm_password: string) {
    return (formGroup: FormGroup): ValidatorFn | ValidatorFn[] => {
        const newControl = formGroup.controls[new_password];
        const confirmControl = formGroup.controls[confirm_password];

        if (confirmControl.errors && !confirmControl.errors.mustMatch) {
            // return if another validator has already found an error on the confirmControl
            return;
        }

        // set error on confirmControl if validation fails
        if (newControl.value !== confirmControl.value) {
            confirmControl.setErrors({ mustMatch: true });
        } else {
            confirmControl.setErrors(null);
        }
    }
}