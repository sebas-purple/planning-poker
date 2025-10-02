import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyComponent, TypographyType } from "src/app/atomic-design/atoms/typography/typography.component";
import { ImageSize } from 'src/app/shared/types/_types';

@Component({
  selector: 'app-create-game-header',
  standalone: true,
  imports: [CommonModule, TypographyComponent],
  templateUrl: './create-game-header.component.html',
  styleUrls: ['./create-game-header.component.scss']
})
export class CreateGameHeaderComponent {
  srcImage: string = "assets/logo/isotipo_blanco.svg";
  alt: string = "isotipo";
  sizeImage: ImageSize = "small";
  textHeader: string = "Crear partida";
  typeTypography: TypographyType = "title";
}