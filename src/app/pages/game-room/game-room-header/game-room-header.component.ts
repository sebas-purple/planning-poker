import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { TypographyComponent } from "src/app/atomic-design/atoms/typography/typography.component";

@Component({
  selector: 'app-game-room-header',
  standalone: true,
  imports: [CommonModule, TypographyComponent],
  templateUrl: './game-room-header.component.html',
  styleUrls: ['./game-room-header.component.scss']
})
export class GameRoomHeaderComponent {
  protected readonly gameService: GameService = inject(GameService);
  textHeader: string = this.gameService.getCurrentGame?.name || "";
}
