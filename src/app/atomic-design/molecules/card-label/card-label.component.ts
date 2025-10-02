import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardType, CardComponent } from '../../atoms/card/card.component';
import { ButtonComponent, ButtonType } from "../../atoms/button/button.component";

@Component({
  selector: 'm-card-label',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  templateUrl: './card-label.component.html',
  styleUrls: ['./card-label.component.scss']
})
export class CardLabelComponent {
  @Input() text!: string;
  @Input({required: true}) cardtype!: CardType;
  @Input() isSelected!: boolean;
  @Input() isRevealed!: boolean;
  @Input() isClickable!: boolean;
  showButton!: boolean;

  @Input() buttonText!: string;
  @Input() buttonType!: ButtonType;

  // habilitar el boton o no
  @Input() enableButton: boolean = true;

  @Input({required: true}) labelText!: string;

  @Output() buttonClicked = new EventEmitter<void>();

  onHover(): void {
    this.showButton = true;

  }

  onLeave(): void {
    this.showButton = false;

  }

  onButtonClicked(): void {
    this.buttonClicked.emit();
  }

}
