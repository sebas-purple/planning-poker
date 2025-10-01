import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomCreateUserComponent } from "./game-room-create-user/game-room-create-user.component";
import { GameRoomFooterComponent } from "./game-room-footer/game-room-footer.component";
import { GameRoomTableComponent } from "./game-room-table/game-room-table.component";
import { GameRoomHeaderComponent } from "./game-room-header/game-room-header.component";
import { DialogComponent } from "src/app/atomic-design/atoms/dialog/dialog.component";
import { PruebasComponent } from "src/app/atomic-design/atoms/pruebas/pruebas.component";
import { InputComponent } from "src/app/atomic-design/atoms/input/input.component";
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, GameRoomCreateUserComponent, GameRoomFooterComponent, GameRoomTableComponent, GameRoomHeaderComponent, DialogComponent, PruebasComponent, InputComponent, ButtonComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent  {
}
