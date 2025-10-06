import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLabelComponent } from './card-label.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { By } from '@angular/platform-browser';

describe('CardLabelComponent', () => {
  let component: CardLabelComponent;
  let fixture: ComponentFixture<CardLabelComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardLabelComponent, ButtonComponent],
    });
    fixture = TestBed.createComponent(CardLabelComponent);
    component = fixture.componentInstance;
    component.cardtype = 'choice';
    component.labelText = 'Test Text';
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card label with text', () => {
    component.labelText = 'Test Text';
    fixture.detectChanges();
    const cardLabel = compiled.querySelector('label');
    expect(cardLabel?.textContent).toContain('Test Text');
  });

  it('should render card label with type', () => {
    component.cardtype = 'choice';
    fixture.detectChanges();
    const cardLabel = compiled.querySelector('label');
    expect(cardLabel?.classList.contains('label--choice')).toBe(true);
  });

  it('should show button when enableButton is true', () => {
    component.enableButton = true;
    fixture.detectChanges();
    const button = compiled.querySelector('a-button');
    expect(button).toBeTruthy();
  });

  it('should emit buttonClicked event when button is clicked', () => {
    jest.spyOn(component.buttonClicked, 'emit');
    component.enableButton = true;
    fixture.detectChanges();

    // con esto se obtiene el hijo
    const sonDebugElement = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonComponent: ButtonComponent = sonDebugElement.componentInstance;

    // con esto se emite el EVENTO del hijo, pero no se ejecuta el metodo del hijo ni su logica, entonces se debe poner como se tiene que ejecutar
    sonComponent.clicked.emit();

    expect(component.buttonClicked.emit).toHaveBeenCalled();
  });
});
