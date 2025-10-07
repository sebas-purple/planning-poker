import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomHeaderComponent } from './game-room-header.component';
import { By } from '@angular/platform-browser';
import { ViewMode } from '../../../core/enums/view-mode.enum';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../core/enums/user-role.enum';
import { GameService } from '../../../services/game.service';

describe('GameRoomHeaderComponent', () => {
  let component: GameRoomHeaderComponent;
  let fixture: ComponentFixture<GameRoomHeaderComponent>;
  let userService: UserService;
  let gameService: GameService;

  // Mocks

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomHeaderComponent],
      providers: [UserService, GameService],
    });
    fixture = TestBed.createComponent(GameRoomHeaderComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    gameService = TestBed.inject(GameService);

    component.currentGame = {
      id: '1',
      name: 'Party Poker',
      createdAt: new Date(),
      players: [],
      maxPlayers: 10,
    };

    jest.spyOn(userService, 'getCurrentUser', 'get').mockReturnValue({
      id: '1',
      name: 'John Doe',
      rol: UserRole.propietario,
      viewMode: ViewMode.jugador,
    });

    jest.spyOn(gameService, 'isAdmin').mockReturnValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the logo', () => {
    const logo = fixture.debugElement.query(By.css('img'));
    expect(logo).toBeTruthy();
    expect(logo.properties['src']).toContain('assets/logo/isotipo_blanco.svg');
  });

  it('should show the title text', () => {
    const title = fixture.debugElement.query(By.css('a-typography'));
    expect(title).toBeTruthy();
    expect(title.componentInstance.text).toContain('Party Poker');
  });

  it('should show the card text', () => {
    const card = fixture.debugElement.query(By.css('a-card'));
    expect(card).toBeTruthy();
    expect(card.componentInstance.text).toBe('JO');
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
});
