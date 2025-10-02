import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGameHeaderComponent } from './create-game-header/create-game-header.component';
import { CreateGameContentComponent } from './create-game-content/create-game-content.component';
import { PruebasComponent } from "src/app/atomic-design/atoms/pruebas/pruebas.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CommonModule, CreateGameHeaderComponent, CreateGameContentComponent, PruebasComponent, ButtonComponent, CardLabelComponent],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent {
}