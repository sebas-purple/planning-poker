import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { GameService } from '../../../services/game.service';
import { Router } from '@angular/router';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { nameValidator } from '../../../shared/validators/name-validator';

@Component({
  selector: 'app-create-game-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-game-content.component.html',
  styleUrls: ['./create-game-content.component.scss'],
})
export class CreateGameContentComponent {
  readonly gameService: GameService = inject(GameService);
  readonly router: Router = inject(Router);

  textLabel: string = 'Nombra la partida';
  textButton: string = 'Crear partida';

  createGameForm = new FormGroup({
    name: new FormControl('', [nameValidator()]),
  });

  // $nameErrors = signal(this.createGameForm.controls.name.errors?.['message']);

  // $formInvalid = computed(() => this.createGameForm.invalid);

  handleSubmit(): void {
    if (this.createGameForm.valid) {
      const name = this.createGameForm.value.name?.trim() || '';
      try {
        const newName = this.capitalizeFirstLetter(name);
        this.createGame(newName);
        this.createGameForm.reset();
        this.router.navigate(['/game-room']);
      } catch (error) {
        console.error('Error al crear partida:', error);
      }
    } else {
      console.log('Formulario inválido al crear partida');
    }
  }

  createGame(gameName: string): void {
    const newGame = this.gameService.createGame(gameName);
    console.log('Partida creada exitosamente:', newGame);
  }

  capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
