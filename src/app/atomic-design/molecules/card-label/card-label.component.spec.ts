import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLabelComponent } from './card-label.component';

describe('CardLabelComponent', () => {
  let component: CardLabelComponent;
  let fixture: ComponentFixture<CardLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardLabelComponent],
    });
    fixture = TestBed.createComponent(CardLabelComponent);
    component = fixture.componentInstance;
    component.cardtype = 'choice';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card label with text', () => {
    component.text = 'Test Text';
    fixture.detectChanges();
    const cardLabel = fixture.nativeElement.querySelector('m-card-label');
    expect(cardLabel.textContent).toContain('Test Text');
  });

  it('should render card label with type', () => {
    component.cardtype = 'choice';
    fixture.detectChanges();
    const cardLabel = fixture.nativeElement.querySelector('m-card-label');
    expect(cardLabel.classList.contains('card-label--choice')).toBe(true);
  });
});
