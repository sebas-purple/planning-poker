import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashScreenComponent } from './splash-screen.component';

describe('SplashScreenComponent', () => {
  let component: SplashScreenComponent;
  let fixture: ComponentFixture<SplashScreenComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SplashScreenComponent],
    });
    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render splash screen with image', () => {
    fixture.detectChanges();
    const image = compiled.querySelector('img');
    expect(image).toBeTruthy();
  });

  it('should render splash screen with correct images', () => {
    fixture.detectChanges();
    const image = compiled.querySelectorAll('img');
    const image1 = image[0];
    const image2 = image[1];
    expect(image1?.src).toContain('assets/logo/isotipo_blanco.svg');
    expect(image2?.src).toContain('assets/logo/logo_blanco.svg');
  });
});
