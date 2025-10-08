import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomCreateUserComponent } from './game-room-create-user.component';
import { By } from '@angular/platform-browser';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { UserService } from '../../../services/user.service';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserRole } from '../../../core/enums/user-role.enum';
import { GameService } from '../../../services/game.service';

describe('GameRoomCreateUserComponent', () => {
  let component: GameRoomCreateUserComponent;
  let fixture: ComponentFixture<GameRoomCreateUserComponent>;
  let userService: UserService;
  let gameService: GameService;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRoomCreateUserComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomCreateUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    gameService = TestBed.inject(GameService);
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

  it('should show error message if the name is less than 5 characters', () => {
    component.gameRoomForm.controls.name.setValue('test');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener mínimo 5 caracteres');
  });

  it('should show error message if the name is more than 20 characters', () => {
    component.gameRoomForm.controls.name.setValue('test12345678901234567890');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener máximo 20 caracteres');
  });

  it('should show error message if the name contains special characters', () => {
    component.gameRoomForm.controls.name.setValue('test@test.com');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain(
      'El nombre no puede tener caracteres especiales'
    );
  });

  it('should show error message if the name contains more than 3 numbers', () => {
    component.gameRoomForm.controls.name.setValue('test1234567890');

    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    fixture.detectChanges();

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre puede tener máximo 3 números');
  });

  it('should be disabled the button if the form is invalid', () => {
    component.gameRoomForm.controls.name.setValue('test@test.com');

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    fixture.detectChanges();

    expect(component.gameRoomForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should create user as propietario', () => {
    const spy = jest.spyOn(userService, 'createUser').mockImplementation();
    component.gameRoomForm.controls.name.setValue('sebas');
    component.userRole = UserRole.propietario;

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    sonAtomButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      'Sebas',
      ViewMode.jugador,
      UserRole.propietario
    );
  });

  it('should create user as invite player', () => {
    const spy = jest.spyOn(userService, 'createUser');
    component.gameRoomForm.controls.name.setValue('sebas');
    component.userRole = UserRole.jugador;

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    sonAtomButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      'Sebas',
      ViewMode.jugador,
      UserRole.jugador
    );
  });

  it('should create user as player', () => {
    const spy = jest.spyOn(userService, 'createUser');
    component.gameRoomForm.controls.name.setValue('sebas');
    component.gameRoomForm.controls.selectedOption.setValue(ViewMode.jugador);
    component.userRole = UserRole.propietario;

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    sonAtomButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      'Sebas',
      ViewMode.jugador,
      UserRole.propietario
    );
  });

  it('should create user as viewer', () => {
    const spy = jest.spyOn(userService, 'createUser');
    component.gameRoomForm.controls.name.setValue('sebas');
    component.userRole = UserRole.propietario;
    component.gameRoomForm.controls.selectedOption.setValue(
      ViewMode.espectador
    );

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    sonAtomButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      'Sebas',
      ViewMode.espectador,
      UserRole.propietario
    );
  });

  // Tests Typescript (LAS MAS IMPORTANTES)

  // handleSubmit

  it('handleSubmit: should not create user if the form is invalid', () => {
    const spy1 = jest
      .spyOn(component, 'capitalizeFirstLetter')
      .mockImplementation();
    const spy2 = jest.spyOn(component, 'createUser').mockImplementation();
    component.gameRoomForm.controls.name.setValue('test*');
    component.handleSubmit();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(component.showDialog).toBe(true);
  });

  it('handleSubmit: should create user if the form is valid', () => {
    const spy1 = jest
      .spyOn(component, 'capitalizeFirstLetter')
      .mockReturnValue('TestName');
    const spy2 = jest.spyOn(component, 'createUser').mockImplementation();
    component.gameRoomForm.controls.name.setValue('testName');
    component.gameRoomForm.controls.selectedOption.setValue(ViewMode.jugador);
    component.userRole = UserRole.propietario;
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.showDialog).toBe(false);
    expect(spy2).toHaveBeenCalledWith(
      'TestName',
      ViewMode.jugador,
      UserRole.propietario
    );
  });

  // capitalizeFirstLetter

  it('capitalizeFirstLetter: should capitalize the first letter of the name', () => {
    const name = 'testName';
    const result = component.capitalizeFirstLetter(name);
    expect(result).toBe('TestName');
  });

  // createUser

  it('createUser: should create user as propietario', () => {
    const spy1 = jest.spyOn(userService, 'createUser').mockReturnValue({
      id: '1',
      name: 'TestName',
      viewMode: ViewMode.jugador,
      rol: UserRole.propietario,
    });
    const spy2 = jest.spyOn(gameService, 'setGameOwner').mockImplementation();
    const spy3 = jest.spyOn(gameService, 'addPlayer').mockImplementation();
    const nameMock = 'TestName';
    const viewModeMock = ViewMode.jugador;
    const userRoleMock = UserRole.propietario;
    component.createUser(nameMock, viewModeMock, userRoleMock);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(nameMock, viewModeMock, userRoleMock);
    expect(spy2).toHaveBeenCalledWith('1');
    expect(spy3).toHaveBeenCalledWith({
      id: '1',
      name: 'TestName',
      viewMode: ViewMode.jugador,
      rol: UserRole.propietario,
    });
  });

  it('createUser: should create user as jugador', () => {
    const spy1 = jest.spyOn(userService, 'createUser').mockReturnValue({
      id: '1',
      name: 'TestName',
      viewMode: ViewMode.jugador,
      rol: UserRole.jugador,
    });
    const spy2 = jest.spyOn(gameService, 'setGameOwner').mockImplementation();
    const spy3 = jest.spyOn(gameService, 'addPlayer').mockImplementation();
    const nameMock = 'TestName';
    const viewModeMock = ViewMode.jugador;
    const userRoleMock = UserRole.jugador;
    component.createUser(nameMock, viewModeMock, userRoleMock);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(nameMock, viewModeMock, userRoleMock);
    expect(spy3).toHaveBeenCalledWith({
      id: '1',
      name: 'TestName',
      viewMode: ViewMode.jugador,
      rol: UserRole.jugador,
    });
  });
});
