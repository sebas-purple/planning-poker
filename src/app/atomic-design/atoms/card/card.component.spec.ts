import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests HTML

  it('should render card with text', () => {
    component.text = 'Test Card';
    const card = fixture.nativeElement.querySelector('div');
    fixture.detectChanges();
    expect(card.textContent).toContain('Test Card');
  });

  // Tests Typescript (LAS MAS IMPORTANTES)

  // onClick

  it('onClick: should emit click event and set isSelected to true when clicked, only if type is choice', () => {
    const spy = jest.spyOn(component.cardClick, 'emit').mockImplementation();
    const card = fixture.nativeElement.querySelector('div');
    component.isSelected = false;
    component.type = 'choice';
    card.click();
    expect(component.isSelected).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('onClick: should not emit click event and not set isSelected to true when type is not choice', () => {
    const spy = jest.spyOn(component.cardClick, 'emit').mockImplementation();
    const card = fixture.nativeElement.querySelector('div');
    component.isSelected = false;

    component.type = 'player';
    card.click();
    expect(component.isSelected).toBe(false);
    expect(spy).not.toHaveBeenCalled();

    component.type = 'viewer';
    card.click();
    expect(component.isSelected).toBe(false);
    expect(spy).not.toHaveBeenCalled();

    component.type = 'profile';
    card.click();
    expect(component.isSelected).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });
});
