import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomFooterComponent } from './game-room-footer.component';

describe('GameRoomFooterComponent', () => {
  let component: GameRoomFooterComponent;
  let fixture: ComponentFixture<GameRoomFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameRoomFooterComponent]
    });
    fixture = TestBed.createComponent(GameRoomFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
