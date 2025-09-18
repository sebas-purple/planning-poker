import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateGame } from './form-create-game';

describe('FormCreateGame', () => {
  let component: FormCreateGame;
  let fixture: ComponentFixture<FormCreateGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreateGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreateGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
