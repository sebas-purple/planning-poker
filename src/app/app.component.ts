import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "./atomic-design/atoms/button/button.component";
import { InputComponent } from "./atomic-design/atoms/input/input.component";
import { LabelComponent } from "./atomic-design/atoms/label/label.component";
import { ImageComponent } from "./atomic-design/atoms/image/image.component";
import { TypographyComponent } from "./atomic-design/atoms/typography/typography.component";
import { CreateGameComponent } from "./pages/create-game/create-game.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonComponent, InputComponent, LabelComponent, ImageComponent, TypographyComponent, CreateGameComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
