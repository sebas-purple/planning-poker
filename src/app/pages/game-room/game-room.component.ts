import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMode } from 'src/app/core/enums/view-mode.enum';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { CardPoolService } from 'src/app/services/card-pool.service';
import { CreateUserComponent } from 'src/app/atomic-design/organisms/create-user/create-user.component';
import { LabelType } from 'src/app/atomic-design/atoms/label/label.component';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { TableComponent } from "src/app/atomic-design/atoms/table/table.component";
import { CardComponent } from "src/app/atomic-design/atoms/card/card.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";
import { Game } from 'src/app/core/interfaces/game.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { Card } from 'src/app/core/interfaces/card.interface';
import { ButtonComponent } from "src/app/atomic-design/atoms/button/button.component";
import { ButtonType } from 'src/app/shared/types/_types';

@Component({
  selector: 'app-game-room',
  standalone: true,
  imports: [CommonModule, CreateUserComponent, TypographyComponent, TableComponent, CardComponent, CardLabelComponent, ButtonComponent],
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  private readonly cardPoolService: CardPoolService = inject(CardPoolService);

  // para manejar la creacion del usuario
  textLabel = "Tu nombre";
  textLabeljugador = "Jugador";
  textLabelespectador = "Espectador";
  textButton = "Continuar";
  labelType: LabelType = "small";
  jugador: ViewMode = ViewMode.jugador;
  espectador: ViewMode = ViewMode.espectador;

  // para manejar el overlay
  currentUser: User | null = this.userService.getCurrentUser;

  // para manejar el game room
  currentGame: Game | null = this.gameService.getCurrentGame;
  textHeader: string = this.currentGame?.name || "";
  textFooter: string = "Elije una carta 👇";
  textFooterType: TypographyType = "subtitle";
  cards: Card[] = [];
  players: User[] = this.currentGame?.players || [];

  ngOnInit(): void {
    this.cards = this.cardPoolService.getCards;
  }

  handleCreateUser(event: {name: string, viewMode: ViewMode}) {
    try {
      const newUser = this.userService.createUser(event.name, event.viewMode);
      this.gameService.setGameOwner(newUser.id);
      this.gameService.addPlayer(newUser);

      // todo: se usa para pruebas, eliminar luego de implementar
      this.gameService.addMockPlayers();

      // todo: se usa para pruebas, eliminar luego de implementar
      this.gameService.addMockSelectedCardsToSelectedCards();

      this.currentUser = newUser;

      console.log('Usuario creado exitosamente:', newUser);
      console.log('Partida creada exitosamente:', this.gameService.getCurrentGame);
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
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

  // para manejar el boton
  textButtonRevealCards: string = "Revelar cartas";
  typeButtonRevealCards: ButtonType = "secondary";

  isRevealed: boolean = false;

  revealCards(): void {
    this.isRevealed = true;
  }

  isButtonRevealCardsVisible(): boolean {
    return this.userService.getCurrentUser?.rol === 'propietario' && this.gameService.isGameOwner(this.userService.getCurrentUser?.id || '') && this.gameService.hasAllPlayersSelectedCard();
  }
}
