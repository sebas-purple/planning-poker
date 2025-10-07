import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'quinary';

// quinary se usa para dar rol administrador a otros usuarios

@Component({
  selector: 'a-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input({ required: true }) text!: string;
  @Input() disabled: boolean = false;
  @Input() type: ButtonType = 'primary';

  // isSuccess se usa para cambiar el estado del boton a success, util solo para el boton tertiary
  @Input() isSuccess: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  public onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
