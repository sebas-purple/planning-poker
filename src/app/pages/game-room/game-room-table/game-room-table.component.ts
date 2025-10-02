import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { ButtonComponent, ButtonType } from "src/app/atomic-design/atoms/button/button.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";
import { User } from 'src/app/core/interfaces/user.interface';
import { Game } from 'src/app/core/interfaces/game.interface';

@Component({
  selector: 'app-game-room-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardLabelComponent],
  templateUrl: './game-room-table.component.html',
  styleUrls: ['./game-room-table.component.scss']
})
export class GameRoomTableComponent implements OnInit, OnDestroy {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  
  private gameSubscription?: Subscription;
  currentGame: Game | null = null;

  ngOnInit(): void {
    // Suscribirse a cambios del juego
    this.gameSubscription = this.gameService.game$.subscribe(game => {
      this.currentGame = game;
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  get players(): User[] {
    return this.currentGame?.players || [];
  }

  textButtonRevealCards: string = "Revelar cartas";
  typeButtonRevealCards: ButtonType = "secondary";
  textButtonNewVoting: string = "Nueva votación";

  get isRevealed(): boolean {
    return this.currentGame?.isRevealed || false;
  }

  isButtonRevealCardsVisible(): boolean {
    return this.userService.getCurrentUser?.rol === 'propietario' && 
           this.gameService.isGameOwner(this.userService.getCurrentUser?.id || '') && 
           this.gameService.hasAtLeastOnePlayerSelectedCard();
  }

  revealCards(): void {
    this.gameService.revealCards();
  }

  startNewVoting(): void {
    this.gameService.startNewVoting();
  }
}
