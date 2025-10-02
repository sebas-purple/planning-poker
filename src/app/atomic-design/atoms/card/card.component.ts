import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardType = 'choice' | 'player' | 'viewer' | 'profile';

@Component({
  selector: 'a-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() text!: string;
  @Input({required: true}) type!: CardType;

  @Input() isSelected: boolean = false;
  @Input() isRevealed: boolean = false;
  @Input() isClickable: boolean = false;

  @Output() cardClick = new EventEmitter<boolean>();

  onClick(): void {
    if (this.type === 'choice') {
      this.isSelected = !this.isSelected;
      this.cardClick.emit(this.isSelected);
    }
  }


}
