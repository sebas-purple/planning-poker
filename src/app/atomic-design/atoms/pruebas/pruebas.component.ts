import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.scss']
})
export class PruebasComponent {
  opciones = ['Opción 1', 'Opción 2', 'Opción 3'];
  opcionSeleccionada = this.opciones[0];
}
