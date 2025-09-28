import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardType = 'choice' | 'player' | 'viewer';

@Component({
  selector: 'a-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  // text
  @Input() text!: string;

  // type
  @Input({required: true}) type!: CardType;
}
