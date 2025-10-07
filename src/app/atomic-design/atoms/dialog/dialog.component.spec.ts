import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
  });

  // 3. Inicializar la vista
  beforeEach(() => {
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  // Tests HTML

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dialog when showDialog is true', () => {
    component.showDialog = true;
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.dialog-content');
    expect(dialog).toBeTruthy();
  });

  it('should not render dialog when showDialog is false', () => {
    component.showDialog = false;
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.dialog-content');
    expect(dialog).toBeNull();
  });
});
