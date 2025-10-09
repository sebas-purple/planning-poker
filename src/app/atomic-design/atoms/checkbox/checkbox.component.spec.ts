import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';
import { FormControl } from '@angular/forms';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl('');
    component.value = '';
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
});
