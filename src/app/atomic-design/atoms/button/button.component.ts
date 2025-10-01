import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

@Component({
  selector: 'a-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input({required: true}) text!: string;
  @Input() disabled: boolean = false;
  @Input() type: ButtonType = 'primary';
  
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}