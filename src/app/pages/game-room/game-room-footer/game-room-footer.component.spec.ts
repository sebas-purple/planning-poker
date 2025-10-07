import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomFooterComponent } from './game-room-footer.component';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../core/enums/user-role.enum';
import { GameService } from '../../../services/game.service';
import { By } from '@angular/platform-browser';
import { ViewMode } from '../../../core/enums/view-mode.enum';

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When user is admin (propietario)', () => {
    beforeEach(() => {
      jest.spyOn(gameService, 'isAdmin').mockReturnValue(true);
      fixture.detectChanges();
    });

    it('should show the scoring mode selector', () => {
      const selector = fixture.debugElement.query(By.css('a-selector'));
      expect(component.isAdmin).toBe(true);
      expect(selector).toBeTruthy();
    });
  });

  describe('When user is not admin', () => {
    beforeEach(() => {
      jest.spyOn(gameService, 'isAdmin').mockReturnValue(false);
      fixture.detectChanges();
    });

    it('should not show the scoring mode selector', () => {
      const selector = fixture.debugElement.query(By.css('a-selector'));
      expect(component.isAdmin).toBe(false);
      expect(selector).toBeNull();
    });
  });

  describe('When user has player view mode', () => {
    beforeEach(() => {
      jest.spyOn(userService, 'getCurrentUser', 'get').mockReturnValue({
        id: '1',
        name: 'John Doe',
        rol: UserRole.propietario,
        viewMode: ViewMode.jugador,
      });
      fixture.detectChanges();
    });

    it('should show the cards', () => {
      expect(component.userService.getCurrentUser?.viewMode).toBe(
        ViewMode.jugador
      );
      const cards = fixture.debugElement.query(By.css('a-card'));
      expect(cards).toBeTruthy();
    });
  });

  describe('When user has spectator view mode', () => {
    beforeEach(() => {
      jest.spyOn(userService, 'getCurrentUser', 'get').mockReturnValue({
        id: '2',
        name: 'Jane Doe',
        rol: UserRole.propietario,
        viewMode: ViewMode.espectador,
      });
      fixture.detectChanges();
    });

    it('should not show the cards', () => {
      expect(component.userService.getCurrentUser?.viewMode).toBe(
        ViewMode.espectador
      );
      const cards = fixture.debugElement.query(By.css('a-card'));
      expect(cards).toBeNull();
    });
  });

  describe('When cards are revealed', () => {
    beforeEach(() => {
      jest.spyOn(gameService, 'getIsRevealed', 'get').mockReturnValue(true);

      fixture.detectChanges();
    });

    it('should show the statistics', () => {
      const statistics = fixture.debugElement.query(By.css('.statistics'));
      expect(component.isRevealed).toBe(true);
      expect(statistics).toBeTruthy();
    });

    it('should show the average', () => {
      const average = fixture.debugElement.query(By.css('.average'));
      expect(component.isRevealed).toBe(true);
      expect(average).toBeTruthy();
    });
  });

  describe('When cards are not revealed', () => {
    beforeEach(() => {
      jest.spyOn(gameService, 'getIsRevealed', 'get').mockReturnValue(false);
      fixture.detectChanges();
    });

    it('should not show the statistics', () => {
      const statistics = fixture.debugElement.query(By.css('.statistics'));
      expect(component.isRevealed).toBe(false);
      expect(statistics).toBeNull();
    });

    it('should not show the average', () => {
      const average = fixture.debugElement.query(By.css('.average'));
      expect(component.isRevealed).toBe(false);
      expect(average).toBeNull();
    });
  });
});
