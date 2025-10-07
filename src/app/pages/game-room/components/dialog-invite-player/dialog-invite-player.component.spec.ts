import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInvitePlayerComponent } from './dialog-invite-player.component';

describe('DialogInvitePlayerComponent', () => {
  let component: DialogInvitePlayerComponent;
  let fixture: ComponentFixture<DialogInvitePlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogInvitePlayerComponent],
    });
    fixture = TestBed.createComponent(DialogInvitePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
