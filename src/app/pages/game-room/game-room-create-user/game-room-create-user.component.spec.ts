import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomCreateUserComponent } from './game-room-create-user.component';
import { By } from '@angular/platform-browser';
import { InputComponent } from '../../../atomic-design/atoms/input/input.component';
import { ButtonComponent } from '../../../atomic-design/atoms/button/button.component';

describe('GameRoomCreateUserComponent', () => {
  let component: GameRoomCreateUserComponent;
  let fixture: ComponentFixture<GameRoomCreateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomCreateUserComponent, InputComponent],
    });
    fixture = TestBed.createComponent(GameRoomCreateUserComponent);
    component = fixture.componentInstance;
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
});
