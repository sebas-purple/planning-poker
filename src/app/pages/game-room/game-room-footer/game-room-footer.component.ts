import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  TypographyComponent,
  TypographyType,
} from 'src/app/atomic-design/atoms/typography/typography.component';
import {
  CardComponent,
  CardType,
} from 'src/app/atomic-design/atoms/card/card.component';
import { CardLabelComponent } from 'src/app/atomic-design/molecules/card-label/card-label.component';
import { UserService } from 'src/app/services/user.service';
import { Card } from 'src/app/core/interfaces/card.interface';
import { CardPoolService } from 'src/app/services/card-pool.service';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/core/interfaces/game.interface';
import { SelectorComponent } from 'src/app/atomic-design/atoms/selector/selector.component';
import {
  SCORING_MODE_LABELS,
  ScoringMode,
} from 'src/app/core/enums/scoring-mode.enum';

@Component({
  selector: 'app-game-room-footer',
  standalone: true,
  imports: [
    CommonModule,
    TypographyComponent,
    CardComponent,
    CardLabelComponent,
    SelectorComponent,
  ],
  templateUrl: './game-room-footer.component.html',
  styleUrls: ['./game-room-footer.component.scss'],
})
export class GameRoomFooterComponent implements OnInit, OnDestroy {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  private readonly cardPoolService: CardPoolService = inject(CardPoolService);
  private gameSubscription?: Subscription;

  // para manejar el cambio de modo de puntaje
  get isAdmin(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.isAdmin(currentUserId);
  }

  get scoringModeLabels(): string[] {
    return Object.values(SCORING_MODE_LABELS);
  }

  get currentScoringModeLabel(): string {
    const mode = this.gameService.getCurrentScoringMode();
    switch (mode) {
      case ScoringMode.FIBONACCI:
        return SCORING_MODE_LABELS[ScoringMode.FIBONACCI];
      case ScoringMode.T_SHIRT:
        return SCORING_MODE_LABELS[ScoringMode.T_SHIRT];
      case ScoringMode.POWERS_OF_2:
        return SCORING_MODE_LABELS[ScoringMode.POWERS_OF_2];
      case ScoringMode.LINEAR:
        return SCORING_MODE_LABELS[ScoringMode.LINEAR];
      default:
        return SCORING_MODE_LABELS[ScoringMode.FIBONACCI];
    }
  }

  get canChangeScoringMode(): boolean {
    const currentUserId = this.userService.getCurrentUser?.id || '';
    return this.gameService.canChangeScoringMode(currentUserId);
  }

  labelScoringMode: string = 'Modo de puntaje:';

  onScoringModeChange(selectedLabel: string): void {
    let newMode: ScoringMode;
    switch (selectedLabel) {
      case SCORING_MODE_LABELS[ScoringMode.FIBONACCI]:
        newMode = ScoringMode.FIBONACCI;
        break;
      case SCORING_MODE_LABELS[ScoringMode.T_SHIRT]:
        newMode = ScoringMode.T_SHIRT;
        break;
      case SCORING_MODE_LABELS[ScoringMode.POWERS_OF_2]:
        newMode = ScoringMode.POWERS_OF_2;
        break;
      case SCORING_MODE_LABELS[ScoringMode.LINEAR]:
        newMode = ScoringMode.LINEAR;
        break;
      default:
        newMode = ScoringMode.FIBONACCI;
        break;
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

  // para manejar la seleccion de cartas
  get canSelectCard(): boolean {
    return (
      this.userService.getCurrentUser?.viewMode === 'jugador' &&
      !this.isRevealed
    );
  }

  textFooterType: TypographyType = 'subtitle';
  textFooter: string = 'Elije una carta 👇';

  cardType: CardType = 'choice';
  isClickableButton: boolean = true;
  cards: Card[] = [];

  ngOnInit(): void {
    this.cards = this.cardPoolService.getCards;

    // Suscribirse a cambios del juego para actualizar cartas cuando cambie el modo
    this.gameSubscription = this.gameService.game$.subscribe(
      (game: Game | null) => {
        if (game?.scoringMode) {
          // Sincronizar CardPoolService y actualizar cartas
          this.cardPoolService.setScoringMode(game.scoringMode);
          this.cards = this.cardPoolService.getCards;
        }
      }
    );
  }

  get playerSelectedCard(): string | null {
    return this.gameService.getPlayerSelectedCard(
      this.userService.getCurrentUser?.id || ''
    );
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

  // para manejar las estadisticas
  get isRevealed(): boolean {
    return this.gameService.getIsRevealed;
  }

  getVotesCountArray(): { value: string; count: number }[] {
    const votesCount = this.gameService.getVotesCount();
    return Object.entries(votesCount)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  }

  getVotesCountLabel(count: number): string {
    return count === 1 ? ' voto' : ' votos';
  }

  isRevealedCard: boolean = true;

  // para manejar el promedio
  getAverageScore(): string {
    return this.gameService.calculateAverageScore();
  }
}
