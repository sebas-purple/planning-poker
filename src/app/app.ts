import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateGame } from './components/organism/create-game/create-game';
import { InputName } from './components/atoms/input-name/input-name';
import { ButtonPrimary } from "./components/atoms/button-primary/button-primary";
import { FormCreateGame } from "./components/molecules/form-create-game/form-create-game";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateGame],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('planning-poker');
}
