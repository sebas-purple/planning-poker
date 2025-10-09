import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  Signal,
  computed,
} from '@angular/core';
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
import { Card } from '../../../core/interfaces/card.interface';
import { Game } from '../../../core/interfaces/game.interface';
import { SelectorComponent } from '../../../atomic-design/atoms/selector/selector.component';
import {
  SCORING_MODE_LABELS,
  ScoringMode,
} from '../../../core/enums/scoring-mode.enum';
import { GameSignalService } from '../../../services/game-signal.service';
import { UserSignalService } from '../../../services/user-signal.service';
import { CardPoolSignalService } from '../../../services/card-pool-signal.service';
import { User } from '../../../core/interfaces/user.interface';

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
  // inyecciones

  readonly userSignalService: UserSignalService = inject(UserSignalService);

  readonly gameSignalService: GameSignalService = inject(GameSignalService);

  readonly cardPoolSignalService: CardPoolSignalService = inject(
    CardPoolSignalService
  );

  gameSubscription?: Subscription;

  // señales

  $gameSignal: Signal<Game | null> = this.gameSignalService.getGameSignal;

  $canChangeScoringMode: Signal<boolean> =
    this.gameSignalService.canChangeScoringMode;

  $getCurrentScoringMode: Signal<string> =
    this.gameSignalService.getCurrentScoringMode;

  $getIsRevealed: Signal<boolean> = this.gameSignalService.getIsRevealed;

  $getVotesCountArray: Signal<{ value: string; count: number }[]> =
    this.gameSignalService.getVotesCountArray;

  $getAverageScore: Signal<string> = this.gameSignalService.getAverageScore;

  $canSelectCard: Signal<boolean> = this.gameSignalService.canSelectCard;

  $userSignal: Signal<User | null> = this.userSignalService.getUserSignal;

  // variables

  labelScoringMode: string = 'Modo de puntaje:';
  textFooterType: TypographyType = 'subtitle';
  textFooter: string = 'Elije una carta 👇';
  cardType: CardType = 'choice';
  isClickableButton: boolean = true;
  cards: Card[] = [];
  isRevealedCard: boolean = true;

  // metodos

  /**
   * Inicializa el componente
   * @author Sebastian Aristizabal Castañeda
   */
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

  /**
   * Destruye el componente
   * @author Sebastian Aristizabal Castañeda
   */
  ngOnDestroy(): void {
    this.gameSubscription?.unsubscribe();
  }

  /**
   * Obtiene los labels de los modos de puntuación
   * @author Sebastian Aristizabal Castañeda
   */
  get scoringModeLabels(): string[] {
    return Object.values(SCORING_MODE_LABELS);
  }

  /**
   * Obtiene el estado de administrador del usuario
   * @author Sebastian Aristizabal Castañeda
   */
  $isAdmin: Signal<boolean> = computed(() => {
    const user = this.$userSignal();
    const game = this.$gameSignal();
    if (!user || !game) return false;
    return this.gameSignalService.isAdmin(user.id, game);
  });

  /**
   * Obtiene la carta seleccionada por el jugador
   * @author Sebastian Aristizabal Castañeda
   */
  getPlayerSelectedCard(): string | null {
    const user = this.$userSignal();
    if (!user) return null;
    return this.gameSignalService.getPlayerSelectedCard(user.id);
  }

  /**
   * Cambia el modo de puntuación
   * @param selectedLabel - El modo de puntuación seleccionado
   * @author Sebastian Aristizabal Castañeda
   */
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

  /**
   * Selecciona una carta
   * @param cardId - El id de la carta seleccionada
   * @param isSelected - El estado de la carta seleccionada
   * @author Sebastian Aristizabal Castañeda
   */
  onCardSelected(cardId: string, isSelected: boolean): void {
    if (isSelected) {
      this.gameSignalService.selectCard(cardId);
    } else {
      this.gameSignalService.unselectCard();
    }
  }

  /**
   * Obtiene el label de los votos según el número de votos
   * @param count - El número de votos
   * @author Sebastian Aristizabal Castañeda
   */
  getVotesCountLabel(count: number): string {
    return count === 1 ? ' voto' : ' votos';
  }
}
