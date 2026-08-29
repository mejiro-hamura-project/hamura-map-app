export type Gender = 'male' | 'female' | 'other';

export type AgeGroup = 'student' | '10s' | '20s' | '30s' | '40s' | '50s' | '60plus';

export interface Registration {
  nickname: string;
  gender: Gender;
  ageGroup: AgeGroup;
}

export interface Checkpoint {
  id: number;
  qrValue: string;
  char: string;
  phraseIndex: number;
}

export interface StampRallyState {
  registration: Registration | null;
  collectedIds: number[];
  phraseSolved: boolean;
  prizeExchanged: boolean;
}
