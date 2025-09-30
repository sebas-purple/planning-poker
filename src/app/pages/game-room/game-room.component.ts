import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { CardPoolService } from 'src/app/services/card-pool.service';
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";
import { GameRoomCreateUserComponent } from "./game-room-create-user/game-room-create-user.component";
import { GameRoomFooterComponent } from "./game-room-footer/game-room-footer.component";
import { GameRoomTableComponent } from "./game-room-table/game-room-table.component";

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, TypographyComponent, GameRoomCreateUserComponent, GameRoomFooterComponent, GameRoomTableComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent  {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  private readonly cardPoolService: CardPoolService = inject(CardPoolService);

  textHeader: string = this.gameService.getCurrentGame?.name || "";
}
