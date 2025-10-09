import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomFooterComponent } from './game-room-footer.component';
import { UserRole } from '../../../core/enums/user-role.enum';

import { ViewMode } from '../../../core/enums/view-mode.enum';
import {
  SCORING_MODE_LABELS,
  ScoringMode,
} from '../../../core/enums/scoring-mode.enum';

describe('GameRoomFooterComponent', () => {
  let component: GameRoomFooterComponent;
  let fixture: ComponentFixture<GameRoomFooterComponent>;

  // Configuracion beforeEach

  // 1. Configurar TestBed
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRoomFooterComponent],
    }).compileComponents();
  });

  // 2. Crear el fixture y componente
  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomFooterComponent);
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

  // getPlayerSelectedCard

  it('getPlayerSelectedCard: should return the player selected card', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'getPlayerSelectedCard')
      .mockReturnValue('2');

    const userMock = {
      id: '1',
      name: 'TestName',
      viewMode: ViewMode.jugador,
      rol: UserRole.propietario,
    };

    (component as any).$userSignal = () => userMock;

    const result = component.getPlayerSelectedCard();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1');
    expect(result).toBe('2');
  });

  it('getPlayerSelectedCard: should return null if the user is not found', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'getPlayerSelectedCard')
      .mockImplementation();

    const userMock = null;

    (component as any).$userSignal = () => userMock;

    const result = component.getPlayerSelectedCard();

    expect(spy1).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  // onScoringModeChange

  it('onScoringModeChange: should change the scoring mode to fibonacci', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'changeScoringMode')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.cardPoolSignalService, 'setScoringMode')
      .mockImplementation();
    const mockSelectedLabel: string =
      SCORING_MODE_LABELS[ScoringMode.FIBONACCI];
    component.onScoringModeChange(mockSelectedLabel);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(ScoringMode.FIBONACCI);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(ScoringMode.FIBONACCI);
  });

  it('onScoringModeChange: should change the scoring mode to t-shirt', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'changeScoringMode')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.cardPoolSignalService, 'setScoringMode')
      .mockImplementation();
    const mockSelectedLabel: string = SCORING_MODE_LABELS[ScoringMode.T_SHIRT];
    component.onScoringModeChange(mockSelectedLabel);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(ScoringMode.T_SHIRT);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(ScoringMode.T_SHIRT);
  });

  it('onScoringModeChange: should change the scoring mode to powers of 2', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'changeScoringMode')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.cardPoolSignalService, 'setScoringMode')
      .mockImplementation();
    const mockSelectedLabel: string =
      SCORING_MODE_LABELS[ScoringMode.POWERS_OF_2];
    component.onScoringModeChange(mockSelectedLabel);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(ScoringMode.POWERS_OF_2);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(ScoringMode.POWERS_OF_2);
  });

  it('onScoringModeChange: should change the scoring mode to linear', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'changeScoringMode')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.cardPoolSignalService, 'setScoringMode')
      .mockImplementation();
    const mockSelectedLabel: string = SCORING_MODE_LABELS[ScoringMode.LINEAR];
    component.onScoringModeChange(mockSelectedLabel);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(ScoringMode.LINEAR);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(ScoringMode.LINEAR);
  });

  it('onScoringModeChange: should change the scoring mode to default', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'changeScoringMode')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.cardPoolSignalService, 'setScoringMode')
      .mockImplementation();
    const mockSelectedLabel: string = 'mockDefault';
    component.onScoringModeChange(mockSelectedLabel);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(ScoringMode.FIBONACCI);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(ScoringMode.FIBONACCI);
  });

  // onCardSelected

  it('onCardSelected: should select the card clicked', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'selectCard')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.gameSignalService, 'unselectCard')
      .mockImplementation();
    const mockCardId: string = '1';
    const mockIsSelected: boolean = true;
    component.onCardSelected(mockCardId, mockIsSelected);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('1');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('onCardSelected: should unselect the card clicked', () => {
    const spy1 = jest
      .spyOn(component.gameSignalService, 'selectCard')
      .mockImplementation();
    const spy2 = jest
      .spyOn(component.gameSignalService, 'unselectCard')
      .mockImplementation();
    const mockCardId: string = '1';
    const mockIsSelected: boolean = false;
    component.onCardSelected(mockCardId, mockIsSelected);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  // getVotesCountLabel

  it('getVotesCountLabel: should return the correct label for 1 vote', () => {
    const mockCount = 1;
    const result = component.getVotesCountLabel(mockCount);
    expect(result).toBe(' voto');
  });

  it('getVotesCountLabel: should return the correct label for 2 votes', () => {
    const mockCount = 2;
    const result = component.getVotesCountLabel(mockCount);
    expect(result).toBe(' votos');
  });
});
