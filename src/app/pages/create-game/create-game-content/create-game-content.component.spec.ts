import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameContentComponent } from './create-game-content.component';

describe('CreateGameContentComponent', () => {
  let component: CreateGameContentComponent;
  let fixture: ComponentFixture<CreateGameContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGameContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
