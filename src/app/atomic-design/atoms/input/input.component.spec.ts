import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputComponent],
    });
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input with label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Test Label');
  });

  it('should render input with error', () => {
    component.error = 'Test Error';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('p');
    expect(error.textContent).toContain('Test Error');
  });

  it('should not render error when error is empty', () => {
    component.error = '';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('p');
    expect(error).toBeNull();
  });
});
