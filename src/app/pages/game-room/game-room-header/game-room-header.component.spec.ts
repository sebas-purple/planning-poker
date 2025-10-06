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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomHeaderComponent],
    });
    fixture = TestBed.createComponent(GameRoomHeaderComponent);
    component = fixture.componentInstance;

    // mock the user service
    const userService = TestBed.inject(UserService);
    Object.defineProperty(userService, 'getCurrentUser', {
      get: jest.fn().mockReturnValue({
        id: '1',
        name: 'John Doe',
        rol: UserRole.propietario,
        viewMode: 'jugador',
      }),
    });

    // mock textCard
    Object.defineProperty(userService, 'textCard', {
      get: jest.fn().mockReturnValue('JO'),
    });

    // mock the game service
    const gameService = TestBed.inject(GameService);
    jest.spyOn(gameService, 'isAdmin').mockReturnValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testear que se muestre el logo
  it('should show the logo', () => {
    const logo = fixture.debugElement.query(By.css('img'));
    expect(logo).toBeTruthy();
    expect(logo.properties['src']).toContain('assets/logo/isotipo_blanco.svg');
  });

  // testear que se muestre el texto del titulo
  it('should show the title text', () => {
    const title = fixture.debugElement.query(By.css('a-typography'));
    expect(title).toBeTruthy();
    expect(title.properties['text']).toBe('Planning Poker');
  });

  // testear que se muestre el texto de la card
  it('should show the card text', () => {
    const card = fixture.debugElement.query(By.css('a-card'));
    expect(card).toBeTruthy();
    expect(card.properties['text']).toBe('John Doe');
  });

  // testear que se muestre el toggle
  it('should show the toggle', () => {
    const toggle = fixture.debugElement.query(By.css('a-toggle'));
    expect(toggle).toBeTruthy();
    expect(toggle.properties['options']).toEqual([
      ViewMode.jugador,
      ViewMode.espectador,
    ]);
    expect(toggle.properties['selectedValue']).toBe(ViewMode.jugador);
  });

  // testear que se muestre el boton de invitar jugadores
  it('should show the invite players button', () => {
    const button = fixture.debugElement.query(By.css('a-button'));
    expect(button).toBeTruthy();
    expect(button.properties['text']).toBe('Invitar jugadores');
  });
});
