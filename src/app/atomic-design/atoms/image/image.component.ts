import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ImageSize = 'small' | 'medium' | 'large' | 'full';

@Component({
  selector: 'a-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input({required: true}) src!: string;
  @Input({required: true}) alt!: string;
  @Input() size: ImageSize = 'medium';
}
