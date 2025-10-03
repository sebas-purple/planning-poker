import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGameHeaderComponent } from './create-game-header/create-game-header.component';
import { CreateGameContentComponent } from './create-game-content/create-game-content.component';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [
    CommonModule,
    CreateGameHeaderComponent,
    CreateGameContentComponent,
  ],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent {
  opciones = ['Opción 1', 'Opción 2', 'Opción 3'];
  opcionSeleccionada = this.opciones[0];

  valor = 'Opción 1';

  onChange(event: string): void {
    this.opcionSeleccionada = event;
  }
}
