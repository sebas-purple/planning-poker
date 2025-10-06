import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomCreateUserComponent } from './game-room-create-user.component';
import { By } from '@angular/platform-browser';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';
import { UserService } from '../../../services/user.service';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserRole } from '../../../core/enums/user-role.enum';

describe('GameRoomCreateUserComponent', () => {
  let component: GameRoomCreateUserComponent;
  let fixture: ComponentFixture<GameRoomCreateUserComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomCreateUserComponent, InputComponent],
      providers: [UserService],
    });
    fixture = TestBed.createComponent(GameRoomCreateUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message if the name is less than 5 characters', () => {
    component.gameRoomForm.controls.name.setValue('test');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener mínimo 5 caracteres');
  });

  it('should show error message if the name is more than 20 characters', () => {
    component.gameRoomForm.controls.name.setValue('test12345678901234567890');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre debe tener máximo 20 caracteres');
  });

  it('should show error message if the name contains special characters', () => {
    component.gameRoomForm.controls.name.setValue('test@test.com');
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
  });

  it('should show error message if the name contains more than 3 numbers', () => {
    component.gameRoomForm.controls.name.setValue('test1234567890');
    fixture.detectChanges();
    const sonAtomInput = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const sonAtomInputComponent: InputComponent =
      sonAtomInput.componentInstance;

    const errorMessage = sonAtomInputComponent.error;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toContain('El nombre puede tener máximo 3 números');
  });

  it('should be disabled the button if the form is invalid', () => {
    component.gameRoomForm.controls.name.setValue('test@test.com');
    fixture.detectChanges();

    const sonAtomButton = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    const sonAtomButtonComponent: ButtonComponent =
      sonAtomButton.componentInstance;

    expect(component.gameRoomForm.invalid).toBeTruthy();
    expect(sonAtomButtonComponent.disabled).toBeTruthy();
  });

  it('should create user as propietario', () => {
    component.userRole = UserRole.propietario;

    // mock the game service
    const spy = jest.spyOn(userService, 'createUser');

    component.gameRoomForm.controls.name.setValue('sebas');
    fixture.detectChanges();

    expect(component.gameRoomForm.valid).toBe(true);

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
    component.userRole = UserRole.jugador;

    // mock the game service
    const spy = jest.spyOn(userService, 'createUser');

    component.gameRoomForm.controls.name.setValue('sebas');
    fixture.detectChanges();

    expect(component.gameRoomForm.valid).toBe(true);

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
    component.userRole = UserRole.propietario;

    const spy = jest.spyOn(userService, 'createUser');

    component.gameRoomForm.controls.name.setValue('sebas');
    component.gameRoomForm.controls.selectedOption.setValue(ViewMode.jugador);
    fixture.detectChanges();

    expect(component.gameRoomForm.valid).toBe(true);

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
    component.userRole = UserRole.propietario;

    const spy = jest.spyOn(userService, 'createUser');

    component.gameRoomForm.controls.name.setValue('sebas');
    component.gameRoomForm.controls.selectedOption.setValue(
      ViewMode.espectador
    );
    fixture.detectChanges();

    expect(component.gameRoomForm.valid).toBe(true);

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
});
