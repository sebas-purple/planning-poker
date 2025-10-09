import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomHeaderComponent } from './game-room-header.component';
import { By } from '@angular/platform-browser';
import { ViewMode } from '../../../core/enums/view-mode.enum';

describe('GameRoomHeaderComponent', () => {
  let component: GameRoomHeaderComponent;
  let fixture: ComponentFixture<GameRoomHeaderComponent>;

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRoomHeaderComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomHeaderComponent);
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

  it('should show the logo', () => {
    const logo = fixture.debugElement.query(By.css('img'));
    expect(logo).toBeTruthy();
    expect(logo.properties['src']).toContain('assets/logo/isotipo_blanco.svg');
  });

  it('should show the toggle', () => {
    const toggle = fixture.debugElement.query(By.css('a-toggle'));
    expect(toggle).toBeTruthy();
    expect(toggle.componentInstance.options).toEqual([
      ViewMode.jugador,
      ViewMode.espectador,
    ]);
    expect(toggle.componentInstance.selectedValue).toBe(ViewMode.jugador);
  });

  it('should show the invite players button', () => {
    const button = fixture.debugElement.query(By.css('a-button'));
    expect(button).toBeTruthy();
    expect(button.componentInstance.text).toBe('Invitar jugadores');
  });

  it('should show the invite players dialog', () => {
    const button = fixture.debugElement.query(By.css('a-button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.showDialog).toBe(true);
  });

  // Tests Typescript (LAS MAS IMPORTANTES)

  // onViewModeChange

  it('onViewModeChange: should change the view mode', () => {
    const spy1 = jest
      .spyOn(component.userSignalService, 'changeViewMode')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.gameSignalService, 'updatePlayer')
      .mockImplementation();

    const mockNewViewMode: ViewMode = ViewMode.espectador;
    component.onViewModeChange(mockNewViewMode);

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(mockNewViewMode);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(component.$userSignal()!);
  });

  // handleButtonInvitePlayersClick

  it('handleButtonInvitePlayersClick: should show the invite players dialog', () => {
    component.isSuccessButton = false;
    component.handleButtonInvitePlayersClick();
    expect(component.showDialog).toBe(true);
  });

  it('handleButtonInvitePlayersClick: should not show the invite players dialog if the button is success', () => {
    component.isSuccessButton = true;
    component.handleButtonInvitePlayersClick();
    expect(component.showDialog).toBe(false);
  });

  // handleCloseDialog

  it('handleCloseDialog: should close the invite players dialog', () => {
    component.showDialog = true;
    component.handleCloseDialog();
    expect(component.showDialog).toBe(false);
  });
});
