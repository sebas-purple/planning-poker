import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomCreateUserComponent } from "./game-room-create-user/game-room-create-user.component";
import { GameRoomFooterComponent } from "./game-room-footer/game-room-footer.component";
import { GameRoomTableComponent } from "./game-room-table/game-room-table.component";
import { GameRoomHeaderComponent } from "./game-room-header/game-room-header.component";

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, GameRoomCreateUserComponent, GameRoomFooterComponent, GameRoomTableComponent, GameRoomHeaderComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent  {

}
