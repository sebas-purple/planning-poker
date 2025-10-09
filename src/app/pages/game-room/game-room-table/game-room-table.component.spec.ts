import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomTableComponent } from './game-room-table.component';
import { By } from '@angular/platform-browser';
import { User } from '../../../core/interfaces/user.interface';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserRole } from '../../../core/enums/user-role.enum';

describe('GameRoomTableComponent', () => {
  let component: GameRoomTableComponent;
  let fixture: ComponentFixture<GameRoomTableComponent>;

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRoomTableComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomTableComponent);
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

  it('should show the players table', () => {
    const table = fixture.debugElement.query(By.css('.table'));
    expect(table).toBeTruthy();
  });

  // Tests Typescript (LAS MAS IMPORTANTES)

  // revealCards

  it('revealCards: should reveal the cards', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'revealCards')
      .mockImplementation();
    component.revealCards();
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  // startNewVoting

  it('startNewVoting: should start a new voting', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'startNewVoting')
      .mockImplementation();
    component.startNewVoting();
    expect(spy1).toHaveBeenCalledTimes(1);
  });

  // isPlayerSpectator

  it('isPlayerSpectator: should return true if the player is spectator', () => {
    const mockPlayer: User = {
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    };
    const result = component.isPlayerSpectator(mockPlayer);
    expect(result).toBe(true);
  });

  // getPlayerSpectatorText

  it('getPlayerSpectatorText: should return the correct text for the player', () => {
    const mockPlayer: User = {
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    };
    const result = component.getPlayerSpectatorText(mockPlayer);
    expect(result).toBe('JO');
  });

  // buttonTextAdminStatus

  it('buttonTextAdminStatus: should return the correct text for the player is admin', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'isAdmin')
      .mockReturnValue(false);
    const mockPlayer: User = {
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    };
    const result = component.buttonTextAdminStatus(mockPlayer);
    expect(result).toBe('👑 Admin');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1', component.$gameSignal()!);
  });

  it('buttonTextAdminStatus: should return the correct text for the player is not admin', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'isAdmin')
      .mockReturnValue(true);
    const mockPlayer: User = {
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    };
    const result = component.buttonTextAdminStatus(mockPlayer);
    expect(result).toBe('❌ Quitar');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1', component.$gameSignal()!);
  });

  // changeAdminStatus

  it('changeAdminStatus: should change the admin status of the player to not admin', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'isAdmin')
      .mockReturnValue(true);
    const spy2 = jest
      .spyOn(component.gameSignalService, 'demoteFromAdmin')
      .mockImplementation();
    const spy3 = jest
      .spyOn(component.gameSignalService, 'promoteToAdmin')
      .mockImplementation();
    const mockPlayerId: string = '1';

    (component as any).$userSignal = () => ({
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    });
    (component as any).$gameSignal = () => ({
      id: '1',
      name: 'Party Poker',
      createdAt: '2025-10-09T22:20:54.505Z',
      players: [],
      maxPlayers: 10,
    });

    component.changeAdminStatus(mockPlayerId);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1', component.$gameSignal()!);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(
      mockPlayerId,
      component.$userSignal()!.id
    );
    expect(spy3).toHaveBeenCalledTimes(0);
  });

  it('changeAdminStatus: should change the admin status of the player to admin', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'isAdmin')
      .mockReturnValue(false);
    const spy2 = jest
      .spyOn(component.gameSignalService, 'demoteFromAdmin')
      .mockImplementation();
    const spy3 = jest
      .spyOn(component.gameSignalService, 'promoteToAdmin')
      .mockImplementation();
    const mockPlayerId: string = '1';

    (component as any).$userSignal = () => ({
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    });
    (component as any).$gameSignal = () => ({
      id: '1',
      name: 'Party Poker',
      createdAt: '2025-10-09T22:20:54.505Z',
      players: [],
      maxPlayers: 10,
    });

    component.changeAdminStatus(mockPlayerId);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1', component.$gameSignal()!);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledWith(
      mockPlayerId,
      component.$userSignal()!.id
    );
    expect(spy2).toHaveBeenCalledTimes(0);
  });

  // hasPlayerSelectedCard

  it('hasPlayerSelectedCard: should return true if the player has selected a card', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'hasPlayerSelectedCard')
      .mockReturnValue(true);
    const mockPlayerId: string = '1';
    const result = component.hasPlayerSelectedCard(mockPlayerId);
    expect(result).toBe(true);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1');
  });

  // getPlayerSelectedCard

  it('getPlayerSelectedCard: should return the correct card for the player', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'getPlayerSelectedCard')
      .mockReturnValue('3');
    const mockPlayerId: string = '1';
    const result = component.getPlayerSelectedCard(mockPlayerId);
    expect(result).toBe('3');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1');
  });

  // getPlayerDisplayName

  it('getPlayerDisplayName: should return the correct display name for the owner player', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'isGameOwner')
      .mockReturnValue(true);
    const spy2 = jest
      .spyOn(component.gameSignalService, 'isAdmin')
      .mockReturnValue(false);
    const mockPlayer: User = {
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.propietario,
    };
    const result = component.getPlayerDisplayName(mockPlayer);
    expect(result).toBe('John Doe 👑');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1', component.$gameSignal()!);
    expect(spy2).not.toHaveBeenCalled();
  });

  it('getPlayerDisplayName: should return the correct display name for the admin player', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'isGameOwner')
      .mockReturnValue(false);
    const spy2 = jest
      .spyOn(component.gameSignalService, 'isAdmin')
      .mockReturnValue(true);
    const mockPlayer: User = {
      id: '1',
      name: 'John Doe',
      viewMode: ViewMode.espectador,
      rol: UserRole.administrador,
    };
    const result = component.getPlayerDisplayName(mockPlayer);
    expect(result).toBe('John Doe ⭐');
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith('1', component.$gameSignal()!);
  });
});
