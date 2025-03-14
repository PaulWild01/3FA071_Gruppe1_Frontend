import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function isDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;

    const dateIsValid = date instanceof Date;

    return dateIsValid ? null : {isDate: {}};
  };
}
