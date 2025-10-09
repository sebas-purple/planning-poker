import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomCreateUserComponent } from './game-room-create-user.component';
import { By } from '@angular/platform-browser';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserRole } from '../../../core/enums/user-role.enum';

describe('GameRoomCreateUserComponent', () => {
  let component: GameRoomCreateUserComponent;
  let fixture: ComponentFixture<GameRoomCreateUserComponent>;

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

  // Tests Typescript (LAS MAS IMPORTANTES)

  // handleSubmit

  it('handleSubmit: should not create user if the form is invalid', () => {
    const spy = jest.spyOn(component, 'createUser').mockImplementation();
    component.gameRoomForm.controls.name.setValue('test*');
    component.handleSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.showDialog).toBe(true);
  });

  it('handleSubmit: should create user if the form is valid', () => {
    const spy2 = jest.spyOn(component, 'createUser').mockImplementation();
    component.gameRoomForm.controls.name.setValue('testName');
    component.gameRoomForm.controls.selectedOption.setValue(ViewMode.jugador);
    component.userRole = UserRole.propietario;
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.showDialog).toBe(false);
    expect(spy2).toHaveBeenCalledWith(
      'TestName',
      ViewMode.jugador,
      UserRole.propietario
    );
  });

  // createUser

  it('createUser: should create user as propietario', () => {
    const spy1 = jest
      .spyOn(component.userSignalService, 'createUser')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.gameSignalService, 'setGameOwner')
      .mockImplementation();
    const spy3 = jest
      .spyOn(component.gameSignalService, 'addPlayer')
      .mockImplementation();

    const nameMock = 'TestName';
    const viewModeMock = ViewMode.jugador;
    const userRoleMock = UserRole.propietario;
    const userMock = {
      id: '1',
      name: nameMock,
      viewMode: viewModeMock,
      rol: userRoleMock,
    };

    (component as any).$userSignal = () => userMock;
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
    const spy1 = jest
      .spyOn(component.userSignalService, 'createUser')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.gameSignalService, 'setGameOwner')
      .mockImplementation();
    const spy3 = jest
      .spyOn(component.gameSignalService, 'addPlayer')
      .mockImplementation();

    const nameMock = 'TestName';
    const viewModeMock = ViewMode.jugador;
    const userRoleMock = UserRole.jugador;
    const userMock = {
      id: '1',
      name: nameMock,
      viewMode: viewModeMock,
      rol: userRoleMock,
    };

    (component as any).$userSignal = () => userMock;
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
