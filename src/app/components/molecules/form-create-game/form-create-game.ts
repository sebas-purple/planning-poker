import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonPrimary } from '../../atoms/button-primary/button-primary';
import { InputName } from '../../atoms/input-name/input-name';
import { NameValidationService } from './name-validation.service';

@Component({
  selector: 'app-form-create-game',
  standalone: true,
  imports: [ ButtonPrimary, InputName ],
  templateUrl: './form-create-game.html',
  styleUrl: './form-create-game.css',
  providers: [NameValidationService ]
})
export class FormCreateGame {
  @Output() createGame = new EventEmitter<string>();

  name = "";
  error = "";

  private readonly validationService = new NameValidationService();

  onNameChange(value: string): void {
    this.name = value;
    this.error = this.validationService.validateName(this.name) || "";
  }

  onSubmit(): void {
    const error = this.validationService.validateName(this.name);
    if (!error) {
      this.createGame.emit(this.name);
    } else {
      this.error = error;
    }
  }

}
