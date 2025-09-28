import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent, ImageSize } from "src/app/atomic-design/atoms/image/image.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule, ImageComponent],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent {
  srcImage = "assets/logo/isotipo_blanco.svg";
  altImage = "isotipo";
  sizeImage: ImageSize = "small";

  srcImagen2 = "assets/logo/logo_blanco.svg";
  altImagen2 = "logo";
  sizeImagen2: ImageSize = "large";

  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/create-game']);
    }, 3000);
  }
}
