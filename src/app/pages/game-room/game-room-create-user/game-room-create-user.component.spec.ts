import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomCreateUserComponent } from './game-room-create-user.component';

describe('GameRoomCreateUserComponent', () => {
  let component: GameRoomCreateUserComponent;
  let fixture: ComponentFixture<GameRoomCreateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomCreateUserComponent]
    });
    fixture = TestBed.createComponent(GameRoomCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
