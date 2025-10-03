import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardType = 'choice' | 'player' | 'viewer' | 'profile';

// choice son las cartas qeu se muestran en el footer de la mesa y se pueden seleccionar 
// player son las cartas que se muestran en la mesa
// viewer son las cartas que se muestran en la mesa cuando un jugador es espectador
// profile es la carta que se muestra en el header de la mesa y representa un usuario

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

  // isSelected se usa para seleccioar una carta, util solo para el tipo choice
  @Input() isSelected: boolean = false;

  // isRevealed se usa para revelar una carta, util solo para el tipo player y choice
  @Input() isRevealed: boolean = false;

  // isClickable se usa para hacer clickable una carta, util solo para el tipo choice
  @Input() isClickable: boolean = false;

  @Output() cardClick = new EventEmitter<boolean>();

  onClick(): void {
    if (this.type === 'choice') {
      this.isSelected = !this.isSelected;
      this.cardClick.emit(this.isSelected);
    }
  }


}
