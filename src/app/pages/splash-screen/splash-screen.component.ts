import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageSize } from 'src/app/shared/types/_types';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent {
  // inyecciones

  readonly router: Router = inject(Router);

  // variables

  srcImage = 'assets/logo/isotipo_blanco.svg';
  alt = 'isotipo';
  sizeImage: ImageSize = 'small';

  srcImagen2 = 'assets/logo/logo_blanco.svg';
  alt2 = 'logo';
  sizeImagen2: ImageSize = 'large';

  // metodos

  /**
   * Navega a la página de creación de juego tras 3 segundos
   * @author Sebastian Aristizabal Castañeda
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/create-game']);
    }, 3000);
  }
}
