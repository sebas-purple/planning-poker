export enum ScoringMode {
  FIBONACCI = 'fibonacci',
  T_SHIRT = 't-shirt',
  POWERS_OF_2 = 'powers-of-2',
  LINEAR = 'linear'
}

export const SCORING_MODE_LABELS = {
  [ScoringMode.FIBONACCI]: 'Fibonacci',
  [ScoringMode.T_SHIRT]: 'T-Shirt Sizes',
  [ScoringMode.POWERS_OF_2]: 'Powers of 2',
  [ScoringMode.LINEAR]: 'Linear'
};
