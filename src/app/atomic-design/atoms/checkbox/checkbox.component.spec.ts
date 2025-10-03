import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';
import { FormControl } from '@angular/forms';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    });
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl('');
    component.value = 'Test Checkbox';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change event when checkbox is changed', () => {
    jest.spyOn(component.formControl, 'setValue');
    const checkbox = fixture.nativeElement.querySelector('input');
    checkbox.click();
    expect(component.formControl.setValue).toHaveBeenCalled();
  });
});
