import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxLabelComponent } from './checkbox-label.component';
import { FormControl } from '@angular/forms';

describe('CheckboxLabelComponent', () => {
  let component: CheckboxLabelComponent;
  let fixture: ComponentFixture<CheckboxLabelComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckboxLabelComponent],
    });
    fixture = TestBed.createComponent(CheckboxLabelComponent);
    component = fixture.componentInstance;
    component.text = 'Test Text';
    component.value = 'Test Value';
    component.formControl = new FormControl('Test Value');
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render checkbox label with text', () => {
    component.text = 'Test Text';
    fixture.detectChanges();
    const checkboxLabel = compiled.querySelector('label');
    expect(checkboxLabel?.textContent).toContain('Test Text');
  });
});
