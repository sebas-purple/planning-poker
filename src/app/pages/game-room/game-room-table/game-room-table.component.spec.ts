import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomTableComponent } from './game-room-table.component';

describe('GameRoomTableComponent', () => {
  let component: GameRoomTableComponent;
  let fixture: ComponentFixture<GameRoomTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomTableComponent]
    });
    fixture = TestBed.createComponent(GameRoomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
