import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameContentComponent } from './create-game-content.component';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';

describe('CreateGameContentComponent', () => {
  let component: CreateGameContentComponent;
  let fixture: ComponentFixture<CreateGameContentComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameContentComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGameContentComponent);
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

  it('should show error message and disable button if the name contains special characters', () => {
    component.createGameForm.controls.name.setValue('test@test.com');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;
    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain(
      'El nombre no puede tener caracteres especiales'
    );
    expect(component.createGameForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message and disable button if the name is less than 5 characters', () => {
    component.createGameForm.controls.name.setValue('test');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener mínimo 5 caracteres');
    expect(component.createGameForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message and disable button if the name is more than 20 characters', () => {
    component.createGameForm.controls.name.setValue('test12345678901234567890');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;
    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener máximo 20 caracteres');
    expect(component.createGameForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message and disable button if the name contains more than 3 numbers', () => {
    component.createGameForm.controls.name.setValue('test1234567890');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;
    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre puede tener máximo 3 números');
    expect(component.createGameForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should show error message if the name contains only numbers', () => {
    component.createGameForm.controls.name.setValue('1234567890');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;
    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre puede tener máximo 3 números');
    expect(component.createGameForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should be able to submit the form if the name is valid', () => {
    component.createGameForm.controls.name.setValue('test123');

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    expect(component.createGameForm.valid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeFalsy();
  });

  // Tests Typescript (LAS MAS IMPORTANTES)

  // handleSubmit

  it('onSubmit: should not create game if the form is invalid', () => {
    const spy1 = jest
      .spyOn(component, 'capitalizeFirstLetter')
      .mockImplementation();
    const spy2 = jest.spyOn(component, 'createGame').mockImplementation();
    const spy3 = jest
      .spyOn(component.createGameForm, 'reset')
      .mockImplementation();
    const spy4 = jest.spyOn(component.router, 'navigate').mockImplementation();
    component.createGameForm.controls.name.setValue('test*');
    component.handleSubmit();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
    expect(spy4).not.toHaveBeenCalled();
  });

  it('onSubmit: should create game if the form is valid', () => {
    const spy1 = jest
      .spyOn(component, 'capitalizeFirstLetter')
      .mockImplementation();
    const spy2 = jest.spyOn(component, 'createGame').mockImplementation();
    const spy3 = jest
      .spyOn(component.createGameForm, 'reset')
      .mockImplementation();
    const spy4 = jest.spyOn(component.router, 'navigate').mockImplementation();
    component.createGameForm.controls.name.setValue('test123');
    component.handleSubmit();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy4).toHaveBeenCalledTimes(1);
  });

  // createGame

  it('createGame: should create game', () => {
    const spy = jest
      .spyOn(component.gameService, 'createGame')
      .mockImplementation();
    const gameNameMock = 'test123';
    component.createGame(gameNameMock);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gameNameMock);
  });
});
