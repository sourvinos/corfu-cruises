import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms'

export class ValidationService {

    static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
        const [firstControlName, ...otherControlNames] = Object.keys(formGroup.controls || {})
        const isValid = otherControlNames.every(controlName => formGroup.get(controlName).value === formGroup.get(firstControlName).value)
        return isValid ? null : { childrenNotEqual: true }
    }

    static containsSpace(control: AbstractControl): { [key: string]: any } {
        return control.value && (control.value as string).indexOf(' ') !== -1 ? { containsSpace: true } : null
    }

    static isTime(control: AbstractControl): { [key: string]: any } {
        if (control.value) {
            const pattern = /\b([01][0-9]|2[0-3]):([0-5][0-9])\b/g
            return pattern.test(control.value) ? null : { isTime: false }
        }
    }

}

export class ConfirmValidParentMatcher {

    isErrorState(control: FormControl | null): boolean {
        return control.parent.invalid && control.touched
    }

}
