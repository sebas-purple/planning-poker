import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/name-validator';
import { ButtonComponent } from 'src/app/atomic-design/atoms/button/button.component';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { InputComponent } from 'src/app/atomic-design/atoms/input/input.component';

@Component({
  selector: 'app-create-game-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-game-content.component.html',
  styleUrls: ['./create-game-content.component.scss'],
})
export class CreateGameContentComponent {
  private readonly gameService: GameService = inject(GameService);
  private readonly router: Router = inject(Router);

  // para el formulario
  textLabel: string = 'Nombra la partida';

  createGameForm = new FormGroup({
    name: new FormControl('', [Validators.required, nameValidator()]),
  });

  // para saber si el input tiene algun error si hay un error en el input se muestra el mensaje de error
  get messageError(): string {
    const errors = this.createGameForm.controls.name.errors;
    if (errors) {
      if (errors['specialChars'] || errors['required']) {
        return errors['message'];
      } else {
        const errorKey = Object.keys(errors)[0];
        return errors[errorKey].message;
      }
    }
    return '';
  }

  // para saber si el input tiene algun valor
  get hasNameInput(): boolean {
    const value = this.createGameForm.controls.name.value;
    return (value ?? '').length > 0;
  }

  //  para el boton
  textButton: string = 'Crear partida';

  handleSubmit() {
    if (this.createGameForm.valid) {
      const name = this.createGameForm.value.name?.trim() || '';
      try {
        const newName = name.charAt(0).toUpperCase() + name.slice(1);
        const newGame = this.gameService.createGame(newName);

        console.log('Partida creada exitosamente:', newGame);

        this.createGameForm.reset();

        this.router.navigate(['/game-room']);
      } catch (error) {
        console.error('Error al crear partida:', error);
      }
    } else {
      console.log('Formulario inválido al crear partida');
    }
  }
}
