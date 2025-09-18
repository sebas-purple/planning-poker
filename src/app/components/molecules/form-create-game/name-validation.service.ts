export class NameValidationService {
  private readonly MIN_LENGTH = 5;
  private readonly MAX_LENGTH = 20;
  private readonly MAX_NUMBERS = 3;
  private readonly SPECIAL_CHARS = /[_,.*#/-]/;

  validateName(name: string): string | null {
    if (!name) {
      return 'El nombre es requerido';
    }

    if (name.length < this.MIN_LENGTH) {
      return `El nombre debe tener al menos ${this.MIN_LENGTH} caracteres`;
    }

    if (name.length > this.MAX_LENGTH) {
      return `El nombre debe tener máximo ${this.MAX_LENGTH} caracteres`;
    }

    if (this.SPECIAL_CHARS.test(name)) {
      return 'El nombre no puede tener caracteres especiales';
    }

    const numberCount = (name.match(/\d/g) || []).length;
    if (numberCount > this.MAX_NUMBERS) {
      return 'El nombre puede tener máximo 3 números';
    }

    if (/^\d+$/.test(name)) {
      return 'El nombre no puede tener solo números';
    }

    return null;
  }
}