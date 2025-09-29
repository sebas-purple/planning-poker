import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LabelType = 'default' | 'small';

@Component({
  selector: 'a-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input({required: true}) text!: string;
  @Input() type: LabelType = 'default';
}
