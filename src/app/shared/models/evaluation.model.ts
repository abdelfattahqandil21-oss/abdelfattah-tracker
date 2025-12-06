export type EvaluationType = 'activity' | 'health' | 'productivity';

export interface Evaluation {
   id: string;
   date: string; // YYYY-MM-DD
   type: EvaluationType;
   score: number; // e.g., 1-10 or 1-5
   notes?: string;
}
