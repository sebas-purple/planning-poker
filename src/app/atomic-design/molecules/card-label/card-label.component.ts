import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardType, CardComponent } from '../../atoms/card/card.component';
import { LabelType, LabelComponent } from '../../atoms/label/label.component';

@Component({
  selector: 'm-card-label',
  standalone: true,
  imports: [CommonModule, CardComponent, LabelComponent],
  templateUrl: './card-label.component.html',
  styleUrls: ['./card-label.component.scss']
})
export class CardLabelComponent {
  @Input() text!: string;
  @Input({required: true}) cardtype!: CardType;
  @Input() isSelected!: boolean;
  @Input() isRevealed!: boolean;

  @Input({required: true}) labelText!: string;
  @Input({required: true}) labelType!: LabelType;

}
