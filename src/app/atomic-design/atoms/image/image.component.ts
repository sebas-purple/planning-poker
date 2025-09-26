import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'a-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input({required: true}) src!: string;
  @Input({required: true}) alt!: string;
  @Input({required: true}) width!: string;
}
