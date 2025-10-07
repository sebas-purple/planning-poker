import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomTableComponent } from './game-room-table.component';
import { By } from '@angular/platform-browser';

describe('GameRoomTableComponent', () => {
  let component: GameRoomTableComponent;
  let fixture: ComponentFixture<GameRoomTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomTableComponent],
    });
    fixture = TestBed.createComponent(GameRoomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the reveal cards button', () => {
    // mock para simular la funcion isButtonRevealCardsVisible
    component.isButtonRevealCardsVisible = () => true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('a-button'));
    expect(button).toBeTruthy();
    expect(button.componentInstance.text).toBe('Revelar cartas');
  });

  it('should show the new voting button', () => {
    component.isButtonRevealCardsVisible = () => true;

    // mock para simular el estado de las cartas
    component['currentGame'] = { isRevealed: true } as any;

    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('a-button'));
    expect(button).toBeTruthy();
    expect(button.componentInstance.text).toBe('Nueva votación');
  });

  it('should show the players table', () => {
    const table = fixture.debugElement.query(By.css('.table'));
    expect(table).toBeTruthy();
  });
});
