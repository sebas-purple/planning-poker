import { Component, inject, OnInit, OnDestroy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  TypographyComponent,
  TypographyType,
} from '../../../atomic-design/atoms/typography/typography.component';
import {
  CardComponent,
  CardType,
} from '../../../atomic-design/atoms/card/card.component';
import { CardLabelComponent } from '../../../atomic-design/molecules/card-label/card-label.component';
import { UserService } from '../../../services/user.service';
import { Card } from '../../../core/interfaces/card.interface';
import { CardPoolService } from '../../../services/card-pool.service';
import { GameService } from '../../../services/game.service';
import { Game } from '../../../core/interfaces/game.interface';
import { SelectorComponent } from '../../../atomic-design/atoms/selector/selector.component';
import {
  SCORING_MODE_LABELS,
  ScoringMode,
} from '../../../core/enums/scoring-mode.enum';
import { GameSignalService } from 'src/app/services/game-signal.service';
import { UserSignalService } from 'src/app/services/user-signal.service';
import { CardPoolSignalService } from 'src/app/services/card-pool-signal.service';

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
  // readonly userService: UserService = inject(UserService);
  readonly userSignalService: UserSignalService = inject(UserSignalService);

  // readonly gameService: GameService = inject(GameService);
  readonly gameSignalService: GameSignalService = inject(GameSignalService);

  // FALTA EL CardPoolService
  // FALTA EL CardPoolService
  // FALTA EL CardPoolService
  // FALTA EL CardPoolService
  // FALTA EL CardPoolService
  // readonly cardPoolService: CardPoolService = inject(CardPoolService);
  readonly cardPoolSignalService: CardPoolSignalService = inject(
    CardPoolSignalService
  );

  gameSubscription?: Subscription;

  // señales

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;
  $isAdmin: Signal<boolean> = this.gameSignalService.isAdmin;
  $canChangeScoringMode: Signal<boolean> =
    this.gameSignalService.canChangeScoringMode;
  $getCurrentScoringMode: Signal<string> =
    this.gameSignalService.getCurrentScoringMode;
  $getPlayerSelectedCard: Signal<string | null> =
    this.gameSignalService.getPlayerSelectedCard;
  $getIsRevealed: Signal<boolean> = this.gameSignalService.getIsRevealed;
  $getVotesCountArray: Signal<{ value: string; count: number }[]> =
    this.gameSignalService.getVotesCountArray;
  $getAverageScore: Signal<string> = this.gameSignalService.getAverageScore;
  $canSelectCard: Signal<boolean> = this.gameSignalService.canSelectCard;

  // variables

  labelScoringMode: string = 'Modo de puntaje:';

  textFooterType: TypographyType = 'subtitle';
  textFooter: string = 'Elije una carta 👇';

  cardType: CardType = 'choice';
  isClickableButton: boolean = true;
  cards: Card[] = [];

  isRevealedCard: boolean = true;

  // para manejar el cambio de modo de puntaje

  get scoringModeLabels(): string[] {
    return Object.values(SCORING_MODE_LABELS);
  }

  // get currentScoringModeLabel(): string {
  //   const mode = this.gameService.getCurrentScoringMode();
  //   switch (mode) {
  //     case ScoringMode.FIBONACCI:
  //       return SCORING_MODE_LABELS[ScoringMode.FIBONACCI];
  //     case ScoringMode.T_SHIRT:
  //       return SCORING_MODE_LABELS[ScoringMode.T_SHIRT];
  //     case ScoringMode.POWERS_OF_2:
  //       return SCORING_MODE_LABELS[ScoringMode.POWERS_OF_2];
  //     case ScoringMode.LINEAR:
  //       return SCORING_MODE_LABELS[ScoringMode.LINEAR];
  //     default:
  //       return SCORING_MODE_LABELS[ScoringMode.FIBONACCI];
  //   }
  // }

  // get canChangeScoringMode(): boolean {
  //   const currentUserId = this.userService.getCurrentUser?.id || '';
  //   return this.gameService.canChangeScoringMode(currentUserId);
  // }

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
    this.gameSignalService.changeScoringMode(newMode);
    this.cardPoolSignalService.setScoringMode(newMode);
    console.log(`Modo de puntaje cambiado a: ${newMode}`);
  }

  // para manejar la seleccion de cartas
  // get canSelectCard(): boolean {
  //   return this.userSignalService.getViewMode() && !this.$getIsRevealed();
  // }

  ngOnInit(): void {
    this.cards = this.cardPoolSignalService.getCards();

    // Suscribirse a cambios del juego para actualizar cartas cuando cambie el modo
    this.gameSubscription = this.gameSignalService.game$.subscribe(
      (game: Game | null) => {
        if (game?.scoringMode) {
          // Sincronizar CardPoolService y actualizar cartas
          this.cardPoolSignalService.setScoringMode(game.scoringMode);
          this.cards = this.cardPoolSignalService.getCards();
        }
      }
    );
  }

  // get playerSelectedCard(): string | null {
  //   return this.gameService.getPlayerSelectedCard(
  //     this.userService.getCurrentUser?.id || ''
  //   );
  // }

  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  onCardSelected(cardId: string, isSelected: boolean): void {
    if (isSelected) {
      this.gameSignalService.selectCard(cardId);
    } else {
      this.gameSignalService.unselectCard();
    }
  }

  // para manejar las estadisticas
  // get isRevealed(): boolean {
  //   return this.gameService.getIsRevealed;
  // }

  // getVotesCountArray(): { value: string; count: number }[] {
  //   const votesCount = this.gameService.getVotesCount();
  //   return Object.entries(votesCount)
  //     .map(([value, count]) => ({ value, count }))
  //     .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  // }

  getVotesCountLabel(count: number): string {
    return count === 1 ? ' voto' : ' votos';
  }

  // para manejar el promedio
  // getAverageScore(): string {
  //   return this.gameService.calculateAverageScore();
  // }
}
