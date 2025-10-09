import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInvitePlayerComponent } from './dialog-invite-player.component';

describe('DialogInvitePlayerComponent', () => {
  let component: DialogInvitePlayerComponent;
  let fixture: ComponentFixture<DialogInvitePlayerComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInvitePlayerComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInvitePlayerComponent);
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

  // Tests Typescript (LAS MAS IMPORTANTES)

  // handleCloseDialog

  it('handleCloseDialog: should emit closeDialog event and close dialog when clicked', () => {
    const spy = jest.spyOn(component.closeDialog, 'emit').mockImplementation();
    component.handleCloseDialog();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.showDialog).toBe(false);
  });
});
