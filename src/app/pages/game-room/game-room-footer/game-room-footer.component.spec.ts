import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomFooterComponent } from './game-room-footer.component';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../core/enums/user-role.enum';
import { GameService } from '../../../services/game.service';
import { By } from '@angular/platform-browser';

describe('GameRoomFooterComponent', () => {
  let component: GameRoomFooterComponent;
  let fixture: ComponentFixture<GameRoomFooterComponent>;
  let userService: UserService;
  let gameService: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomFooterComponent],
      providers: [UserService, GameService],
    });
    fixture = TestBed.createComponent(GameRoomFooterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    gameService = TestBed.inject(GameService);

    const spyUserService = jest.spyOn(userService, 'getCurrentUser', 'get');
    const spyGameService = jest.spyOn(gameService, 'isAdmin');

    // // mock the user service
    // Object.defineProperty(userService, 'getCurrentUser', {
    //   get: jest.fn().mockReturnValue({
    //     id: '1',
    //     name: 'John Doe',
    //     rol: UserRole.propietario,
    //     viewMode: 'jugador',
    //   }),
    // });

    // // mock the game service
    // jest.spyOn(gameService, 'isAdmin').mockReturnValue(true);
    // // mock isRevealed
    // Object.defineProperty(gameService, 'getIsRevealed', {
    //   get: jest.fn().mockReturnValue(true),
    // });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the scoring mode selector if the user is admin', () => {
    const selector = fixture.debugElement.query(By.css('a-selector'));
    expect(selector).toBeTruthy();
    expect(component.isAdmin).toBe(true);
  });

  // ESTAS PRUEBAS PASAN DEPENDIENDO DEL ESTADO DE LA SESION

  // it('should not show the scoring mode selector if the user is not admin', () => {
  //   const selector = fixture.debugElement.query(By.css('a-selector'));
  //   expect(selector).toBeNull();
  //   expect(component.isAdmin).toBe(false);
  // });

  // it('should show the cards if the user has player view mode', () => {
  //   const cards = fixture.debugElement.query(By.css('a-card'));
  //   expect(component.userService.getCurrentUser?.viewMode).toBe('jugador');
  //   expect(cards).toBeTruthy();
  // });

  // it('should not show the cards if the user has spectator view mode', () => {
  //   const cards = fixture.debugElement.query(By.css('a-card'));
  //   expect(component.userService.getCurrentUser?.viewMode).toBe('espectador');
  //   expect(cards).toBeNull();
  // });

  // testear que se muestren las estadisticas cuando se revelan las cartas
  it('should show the statistics when the cards are revealed', () => {
    const statistics = fixture.debugElement.query(By.css('.statistics'));
    expect(component.isRevealed).toBe(true);
    expect(statistics).toBeTruthy();
  });

  // testear que se muestre el promedio cuando se revelan las cartas
  it('should show the average when the cards are revealed', () => {
    const average = fixture.debugElement.query(By.css('.average'));
    expect(component.isRevealed).toBe(true);
    expect(average).toBeTruthy();
  });
});
