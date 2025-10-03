import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypographyComponent } from './typography.component';

describe('TypographyComponent', () => {
  let component: TypographyComponent;
  let fixture: ComponentFixture<TypographyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypographyComponent],
    });
    fixture = TestBed.createComponent(TypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render typography with text', () => {
    component.text = 'Test Text';
    fixture.detectChanges();
    const typography = fixture.nativeElement.querySelector('p');
    expect(typography.textContent).toContain('Test Text');
  });

  it('should render typography with type', () => {
    component.type = 'title';
    fixture.detectChanges();
    const typography = fixture.nativeElement.querySelector('p');
    expect(typography.classList.contains('typography--title')).toBe(true);
  });
});
