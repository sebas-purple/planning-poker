import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardComponent],
    });
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card with text', () => {
    component.text = 'Test Card';
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div');
    expect(card.textContent).toContain('Test Card');
  });

  it('should emit click event when clicked, only if type is choice', () => {
    jest.spyOn(component.cardClick, 'emit');
    const card = fixture.nativeElement.querySelector('div');
    component.type = 'choice';
    card.click();
    expect(component.cardClick.emit).toHaveBeenCalled();
  });

  it('should not emit click event when disabled', () => {
    jest.spyOn(component.cardClick, 'emit');
    const card = fixture.nativeElement.querySelector('div');
    card.click();
    expect(component.cardClick.emit).not.toHaveBeenCalled();
  });

  it('should not emit click event when type is not choice', () => {
    jest.spyOn(component.cardClick, 'emit');
    const card = fixture.nativeElement.querySelector('div');
    component.type = 'player';
    card.click();
    expect(component.cardClick.emit).not.toHaveBeenCalled();

    component.type = 'viewer';
    card.click();
    expect(component.cardClick.emit).not.toHaveBeenCalled();

    component.type = 'profile';
    card.click();
    expect(component.cardClick.emit).not.toHaveBeenCalled();
  });

  it('should set isSelected to true when clicked, only if type is choice', () =>  {
    component.type = 'choice';
    const card = fixture.nativeElement.querySelector('div');
    card.click();
    expect(component.isSelected).toBe(true);
  });

  it('should apply correct classes when isRevealed is true for player type', () => {
    component.isRevealed = true;
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div');
    expect(card.classList.contains('card--revealed')).toBe(true);
  });


  it('should apply correct class when isClickable is true', () => {
    component.isClickable = true;
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('div');
    expect(card.classList.contains('card--clickable')).toBe(true);
  });

});
