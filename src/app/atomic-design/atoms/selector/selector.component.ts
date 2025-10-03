import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'a-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent {

  @Input({required: true}) options: string[] = [];
  @Input({required: true}) selectedOption: string = this.options[0];

  @Output() selectedOptionEmitter = new EventEmitter<string>();
  @Input({required: true}) label!: string;
  @Input() disabled: boolean = false;

  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedOption = target.value;
    this.selectedOptionEmitter.emit(this.selectedOption);
  }

}
