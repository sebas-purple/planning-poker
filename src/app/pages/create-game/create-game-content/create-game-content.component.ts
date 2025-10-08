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
import { GameSignalService } from '../../../services/game-signal.service';

@Component({
  selector: 'app-create-game-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-game-content.component.html',
  styleUrls: ['./create-game-content.component.scss'],
})
export class CreateGameContentComponent {
  // readonly gameService: GameService = inject(GameService);
  readonly gameSignalService: GameSignalService = inject(GameSignalService);
  readonly router: Router = inject(Router);

  textLabel: string = 'Nombra la partida';
  textButton: string = 'Crear partida';

  createGameForm = new FormGroup({
    name: new FormControl('', [nameValidator()]),
  });

  $gameSignal = this.gameSignalService.getGameSignal;

  // $nameErrors = signal(this.createGameForm.controls.name.errors?.['message']);

  // $formInvalid = computed(() => this.createGameForm.invalid);

  handleSubmit(): void {
    if (this.createGameForm.valid) {
      const name = this.createGameForm.value.name?.trim() || '';
      const newName = this.capitalizeFirstLetter(name);

      // this.createGame(newName);
      this.createGameSignal(newName);
      this.createGameForm.reset();
      this.router.navigate(['/game-room']);
    } else {
      // PARA PROBAR LAS SIGNALS
      // this.gameSignalService.createGame(
      //   this.createGameForm.value.name?.trim() || ''
      // );
      console.log('Formulario inválido al crear partida');
    }
  }

  // createGame(gameName: string): void {
  //   try {
  //     const newGame = this.gameService.createGame(gameName);
  //     console.log('Partida creada exitosamente:', newGame);
  //   } catch (error) {
  //     console.error('Error al crear partida:', error);
  //   }
  // }

  createGameSignal(gameName: string): void {
    try {
      this.gameSignalService.createGame(gameName);
      console.log('Partida creada exitosamente:', this.$gameSignal());
    } catch (error) {
      console.error('Error al crear partida:', error);
    }
  }

  capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
