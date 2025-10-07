import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
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

  it('should render button with text', () => {
    component.text = 'Test Button';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Test Button');
  });

  // Tests Typescript
  // onClick

  it('onClick: should emit click event when clicked', () => {
    const spy = jest.spyOn(component.clicked, 'emit').mockImplementation();
    component['onClick']();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('onClick: should not emit click event when disabled', () => {
    const spy = jest.spyOn(component.clicked, 'emit').mockImplementation();
    component.disabled = true;
    component['onClick']();
    expect(spy).not.toHaveBeenCalled();
  });
});
