import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputName } from './input-name';

describe('InputName', () => {
  let component: InputName;
  let fixture: ComponentFixture<InputName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputName]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
