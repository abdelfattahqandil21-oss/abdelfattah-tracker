export type Meal = 'breakfast' | 'lunch' | 'dinner';
export type Timing = 'before' | 'after';

export interface SugarEntry {
   id: string;
   date: string;
   meal: Meal;
   timing: Timing;
   value: number | null;
   note?: string;
}

export const meals: Meal[] = ['breakfast', 'lunch', 'dinner'];
export const timings: Timing[] = ['before', 'after'];
