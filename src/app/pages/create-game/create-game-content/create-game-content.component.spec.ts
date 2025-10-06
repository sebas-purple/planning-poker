import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameContentComponent } from './create-game-content.component';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';

describe('CreateGameContentComponent', () => {
  let component: CreateGameContentComponent;
  let fixture: ComponentFixture<CreateGameContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameContentComponent, InputComponent, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGameContentComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testear que si se pone un nombre con caracteres especiales, se muestre el mensaje de error
  it('should show error message if the name contains special characters', () => {
    component.createGameForm.controls.name.setValue('test@test.com');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain(
      'El nombre no puede tener caracteres especiales'
    );
    expect(component.createGameForm.invalid).toBeTruthy();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message if the name is less than 5 characters', () => {
    component.createGameForm.controls.name.setValue('test');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener mínimo 5 caracteres');
    expect(component.createGameForm.invalid).toBeTruthy();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message if the name is more than 20 characters', () => {
    component.createGameForm.controls.name.setValue('test12345678901234567890');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener máximo 20 caracteres');
    expect(component.createGameForm.invalid).toBeTruthy();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message if the name contains more than 3 numbers', () => {
    component.createGameForm.controls.name.setValue('test1234567890');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre puede tener máximo 3 números');
    expect(component.createGameForm.invalid).toBeTruthy();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message if the name contains only numbers', () => {
    component.createGameForm.controls.name.setValue('1234567890');
    fixture.detectChanges();

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;

    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre puede tener máximo 3 números');
    expect(component.createGameForm.invalid).toBeTruthy();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should be able to submit the form if the name is valid', () => {
    component.createGameForm.controls.name.setValue('test123');
    fixture.detectChanges();

    expect(component.createGameForm.valid).toBeTruthy();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(sonAtomButtonComponent.disabled).toBeFalsy();
  });
});
