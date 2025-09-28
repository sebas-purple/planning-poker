import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TypographyType = 'title' | 'subtitle' | 'error';

@Component({
  selector: 'a-typography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {
  @Input({required: true}) text!: string;
  @Input() type: TypographyType = 'title';
}