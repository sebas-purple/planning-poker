import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { Router } from '@angular/router';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { nameValidator } from '../../../shared/validators/name-validator';
import { GameSignalService } from '../../../services/game-signal.service';
import { Game } from '../../../core/interfaces/game.interface';
import { capitalizeFirstLetter } from '../../../shared/functions/capitalize-first-letter';

@Component({
  selector: 'app-create-game-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './create-game-content.component.html',
  styleUrls: ['./create-game-content.component.scss'],
})
export class CreateGameContentComponent {
  // inyecciones

  readonly gameSignalService: GameSignalService = inject(GameSignalService);
  readonly router: Router = inject(Router);

  // señales

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;

  // variables

  textLabel: string = 'Nombra la partida';
  textButton: string = 'Crear partida';

  createGameForm = new FormGroup({
    name: new FormControl('', [nameValidator()]),
  });

  // metodos

  /**
   * Maneja el envío del formulario para crear una partida
   * @author Sebastian Aristizabal Castañeda
   */
  handleSubmit(): void {
    if (this.createGameForm.valid) {
      const name = this.createGameForm.value.name?.trim() || '';
      const newName = capitalizeFirstLetter(name);
      this.gameSignalService.createGame(newName);
      this.createGameForm.reset();
      this.router.navigate(['/game-room']);
    } else {
      console.log('handleSubmit: Formulario inválido al crear partida');
    }
  }
}
