import { Component } from '@angular/core';
import { FormCreateGame } from '../../molecules/form-create-game/form-create-game';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [ FormCreateGame ],
  templateUrl: './create-game.html',
  styleUrl: './create-game.css'
})
export class CreateGame {
  onCreateGame(name: string): void {
    console.log("Creando partida:", name);
  }
}
