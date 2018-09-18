import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { observableOf } from '@utils/observable';
import { RegistrationService } from '../../providers/registration/registration';

/**
 * This directive allows you to validate an email form input's value against the BioPocket backend.
 * Add an `exists` attribute to any `<input type="email">` to attach it the directive.
 * The value of this attribute defines how the validator will behave:
 * * Passing a `true` value means that the validation will fail if the email does not exists in the backend
 * * Passing a `false` value means that the validation will fail if the email actually exists in the backend
 *
 * Note that the value is tested against the `Registration` backend resource.
 */
@Directive({
  selector: '[email][exists][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: EmailExistenceValidator,
      multi: true
    }
  ]
})
export class EmailExistenceValidator implements AsyncValidator {

  shouldExist: boolean;

  @Input('exists')
  set shouldExists(value: string) {
    this.shouldExist = value !== 'false';
  }

  constructor(private readonly registrationService: RegistrationService) { }

  /**
   * Executes the validation logic.
   * If the validation fails, the validation error object will contain an `existence` key set to `true`.
   * `null` is returned if the validation passes or an error occured while checking the email existence.
   * @param control The input whose value is validated.
   */
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.registrationService.checkEmailExistence(control.value)
      .pipe(map(exists => ((!this.shouldExist && exists) || (this.shouldExist && !exists)) ? { existence: true } : null))
      .catch(() => observableOf(null));
  }

}

