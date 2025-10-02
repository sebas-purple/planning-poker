import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomHeaderComponent } from './game-room-header.component';

describe('GameRoomHeaderComponent', () => {
  let component: GameRoomHeaderComponent;
  let fixture: ComponentFixture<GameRoomHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomHeaderComponent]
    });
    fixture = TestBed.createComponent(GameRoomHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
