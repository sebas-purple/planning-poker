import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  const MIN_LENGTH = 5;
  const MAX_LENGTH = 20;
  const MAX_NUMBERS = 3;
  const SPECIAL_CHARS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  return (control: AbstractControl): ValidationErrors | null => {
    let name = control.value;

    if (name) {
      name = name.trim();
    }

    if (!name) {
      return { required: true, message: 'El nombre es requerido' };
    }

    if (name.length < MIN_LENGTH) {
      return {
        minlength: MIN_LENGTH,
        message: 'El nombre debe tener mínimo 5 caracteres',
      };
    }

    if (name.length > MAX_LENGTH) {
      return {
        maxlength: MAX_LENGTH,
        message: 'El nombre debe tener máximo 20 caracteres',
      };
    }

    const numberCount = (name.match(/\d/g) || []).length;
    if (numberCount > MAX_NUMBERS) {
      return {
        maxNumbers: MAX_NUMBERS,
        actual: numberCount,
        message: 'El nombre puede tener máximo 3 números',
      };
    }

    if (SPECIAL_CHARS.test(name)) {
      //  ya entendi, cuando se usa specialChars el mensaje se envia diferente a los demas, entonces desde el html se debe recibir diferente
      return {
        specialChars: true,
        message: 'El nombre no puede tener caracteres especiales',
      };
    }

    return null;
  };
}
