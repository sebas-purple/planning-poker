import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameHeaderComponent } from './create-game-header.component';

describe('CreateGameHeaderComponent', () => {
  let component: CreateGameHeaderComponent;
  let fixture: ComponentFixture<CreateGameHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGameHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});