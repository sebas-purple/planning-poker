import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameHeaderComponent } from './create-game-header.component';

describe('CreateGameHeaderComponent', () => {
  let component: CreateGameHeaderComponent;
  let fixture: ComponentFixture<CreateGameHeaderComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameHeaderComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameHeaderComponent);
    component = fixture.componentInstance;
  });

  // 3. Inicializar la vista
  beforeEach(() => {
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  // Tests HTML

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
