import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { ButtonComponent, ButtonType } from "src/app/atomic-design/atoms/button/button.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";
import { User } from 'src/app/core/interfaces/user.interface';

@Component({
  selector: 'app-game-room-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardLabelComponent],
  templateUrl: './game-room-table.component.html',
  styleUrls: ['./game-room-table.component.scss']
})
export class GameRoomTableComponent {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  players: User[] = this.gameService.getCurrentGame?.players || [];

  textButtonRevealCards: string = "Revelar cartas";
  typeButtonRevealCards: ButtonType = "secondary";
  textButtonNewVoting: string = "Nueva votación";

  get isRevealed(): boolean {
    return this.gameService.getIsRevealed;
  }

  isButtonRevealCardsVisible(): boolean {
    return this.userService.getCurrentUser?.rol === 'propietario' && 
           this.gameService.isGameOwner(this.userService.getCurrentUser?.id || '') && 
           this.gameService.hasAllPlayersSelectedCard();
  }

  revealCards(): void {
    this.gameService.revealCards();
  }

  startNewVoting(): void {
    this.gameService.startNewVoting();
  }
}
