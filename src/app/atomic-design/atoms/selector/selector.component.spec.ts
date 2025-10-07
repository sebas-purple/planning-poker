import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorComponent } from './selector.component';

describe('SelectorComponent', () => {
  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorComponent);
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

  it('should render selector with label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Test Label');
  });

  it('should render selector with options', () => {
    component.options = ['Test Option 1', 'Test Option 2'];
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(2);
    expect(options[0].textContent).toContain('Test Option 1');
    expect(options[1].textContent).toContain('Test Option 2');
  });

  it('should not be enabled when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const selector = fixture.nativeElement.querySelector('select');
    expect(selector.disabled).toBe(true);
  });

  // Tests Typescript (LAS MAS IMPORTANTES)

  // onSelect

  it('onSelect: should emit selectedOption event when selector is changed', () => {
    const spy = jest
      .spyOn(component.selectedOptionEmitter, 'emit')
      .mockImplementation();

    const eventMock = {
      target: {
        value: 'option-mock',
      },
    } as unknown as Event;

    component['onSelect'](eventMock);
    expect(component.selectedOption).toBe('option-mock');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('option-mock');
  });
});
