import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
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

  it('should render input with label', () => {
    const label = fixture.nativeElement.querySelector('label');
    component.label = 'Test Label';
    fixture.detectChanges();
    expect(label.textContent).toContain('Test Label');
  });

  it('should render input with error', () => {
    component.error = 'Test Error';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('p');
    expect(error.textContent).toContain('Test Error');
  });

  it('should not render error when error is empty', () => {
    const error = fixture.nativeElement.querySelector('p');
    component.error = '';
    fixture.detectChanges();
    expect(error).toBeNull();
  });
});
