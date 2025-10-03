import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { CardComponent } from "src/app/atomic-design/atoms/card/card.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";
import { UserService } from 'src/app/services/user.service';
import { Card } from 'src/app/core/interfaces/card.interface';
import { CardPoolService } from 'src/app/services/card-pool.service';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/core/interfaces/game.interface';
import { SelectorComponent } from "src/app/atomic-design/atoms/selector/selector.component";
import { ScoringMode } from 'src/app/core/enums/scoring-mode.enum';

@Component({
  selector: 'app-game-room-footer',
  standalone: true,
  imports: [CommonModule, TypographyComponent, CardComponent, CardLabelComponent, SelectorComponent],
  templateUrl: './game-room-footer.component.html',
  styleUrls: ['./game-room-footer.component.scss']
})
export class GameRoomFooterComponent implements OnInit, OnDestroy {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  private readonly cardPoolService: CardPoolService = inject(CardPoolService);

  private gameSubscription?: Subscription;
  textFooter: string = "Elije una carta 👇";
  textFooterType: TypographyType = "subtitle";
  cards: Card[] = [];

  get isRevealed(): boolean {
    return this.gameService.getIsRevealed;
  }

  ngOnInit(): void {
    // Obtener cartas iniciales
    this.cards = this.cardPoolService.getCards;
    
    // Suscribirse a cambios del juego para actualizar cartas cuando cambie el modo
    this.gameSubscription = this.gameService.game$.subscribe((game: Game | null) => {
      if (game?.scoringMode) {
        // Sincronizar CardPoolService y actualizar cartas
        this.cardPoolService.setScoringMode(game.scoringMode);
        this.cards = this.cardPoolService.getCards;
      }
    });
  }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  onCardSelected(cardId: string, isSelected: boolean): void {
    const currentUser = this.userService.getCurrentUser;
    if (!currentUser) return;

    if (isSelected) {
      this.gameService.selectCard(currentUser.id, cardId);
    } else {
      this.gameService.unselectCard(currentUser.id);
    }
  }

  getVotesCountArray(): { value: string, count: number }[] {
    const votesCount = this.gameService.getVotesCount();
    return Object.entries(votesCount)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  }

  getAverageScore(): string {
    return this.gameService.calculateAverageScore();
  }

  // Propiedades para el selector de modo de puntaje

  labelScoringMode: string = "Modo de puntaje:";

  get isAdmin(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.isAdmin(currentUserId);
  }

  get scoringModeLabels(): string[] {
    return ['Fibonacci', 'T-Shirt Sizes', 'Powers of 2', 'Linear'];
  }

  get currentScoringMode(): ScoringMode {
    return this.gameService.getCurrentScoringMode();
  }

  get currentScoringModeLabel(): string {
    const mode = this.currentScoringMode;
    switch(mode) {
      case ScoringMode.FIBONACCI: return 'Fibonacci';
      case ScoringMode.T_SHIRT: return 'T-Shirt Sizes';
      case ScoringMode.POWERS_OF_2: return 'Powers of 2';
      case ScoringMode.LINEAR: return 'Linear';
      default: return 'Fibonacci';
    }
  }

  get canChangeScoringMode(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.canChangeScoringMode(currentUserId);
  }

  onScoringModeChange(selectedLabel: string): void {
    // Convertir el label de vuelta al enum
    let newMode: ScoringMode;
    switch(selectedLabel) {
      case 'Fibonacci': newMode = ScoringMode.FIBONACCI; break;
      case 'T-Shirt Sizes': newMode = ScoringMode.T_SHIRT; break;
      case 'Powers of 2': newMode = ScoringMode.POWERS_OF_2; break;
      case 'Linear': newMode = ScoringMode.LINEAR; break;
      default: return;
    }

    const currentUserId = this.userService.getCurrentUser?.id || '';
    const success = this.gameService.changeScoringMode(newMode, currentUserId);
    
    if (success) {
      // Sincronizar inmediatamente el CardPoolService
      this.cardPoolService.setScoringMode(newMode);
      console.log(`Modo de puntaje cambiado a: ${newMode}`);
    } else {
      console.error('Error al cambiar el modo de puntaje');
    }
  }

}
