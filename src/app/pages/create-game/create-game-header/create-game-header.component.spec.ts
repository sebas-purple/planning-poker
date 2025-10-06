import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameHeaderComponent } from './create-game-header.component';

describe('CreateGameHeaderComponent', () => {
  let component: CreateGameHeaderComponent;
  let fixture: ComponentFixture<CreateGameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render create game header with correct image', () => {
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector('img');
    expect(image).toBeTruthy();
    expect(image?.src).toContain('assets/logo/isotipo_blanco.svg');
  });

  it('should render create game header with correct text', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('a-typography');
    expect(text).toBeTruthy();
    expect(text?.textContent).toContain('Crear partida');
  });
});
