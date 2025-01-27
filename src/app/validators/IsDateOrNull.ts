import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function isDateOrNull(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;

    const dateIsValid = date instanceof Date || date == '' || date == null;

    return dateIsValid ? null : {isDateOrNull: {}};
  };
}
