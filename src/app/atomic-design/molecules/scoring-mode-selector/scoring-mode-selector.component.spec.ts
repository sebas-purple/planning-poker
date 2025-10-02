import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringModeSelectorComponent } from './scoring-mode-selector.component';

describe('ScoringModeSelectorComponent', () => {
  let component: ScoringModeSelectorComponent;
  let fixture: ComponentFixture<ScoringModeSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScoringModeSelectorComponent]
    });
    fixture = TestBed.createComponent(ScoringModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
