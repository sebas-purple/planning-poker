import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { CardComponent } from "src/app/atomic-design/atoms/card/card.component";
import { CardLabelComponent } from "src/app/atomic-design/molecules/card-label/card-label.component";
import { UserService } from 'src/app/services/user.service';
import { Card } from 'src/app/core/interfaces/card.interface';
import { CardPoolService } from 'src/app/services/card-pool.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-room-footer',
  standalone: true,
  imports: [CommonModule, TypographyComponent, CardComponent, CardLabelComponent],
  templateUrl: './game-room-footer.component.html',
  styleUrls: ['./game-room-footer.component.scss']
})
export class GameRoomFooterComponent implements OnInit {
  protected readonly userService: UserService = inject(UserService);
  protected readonly gameService: GameService = inject(GameService);
  private readonly cardPoolService: CardPoolService = inject(CardPoolService);

  isRevealed: boolean = false;

  textFooter: string = "Elije una carta 👇";
  textFooterType: TypographyType = "subtitle";
  cards: Card[] = [];

  ngOnInit(): void {
    this.cards = this.cardPoolService.getCards;
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

  getAverageScore(): number {
    return this.gameService.calculateAverageScore();
  }

}
