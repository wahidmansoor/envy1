import { calculateBSA, calculateEQD2 } from './calculations';

export function calculateResult(calculatorId: string, values: Record<string, string>): string {
  switch (calculatorId) {
    case 'bsa':
      const height = parseFloat(values.height);
      const weight = parseFloat(values.weight);
      return calculateBSA(height, weight).toFixed(2) + ' m²';
    
    case 'eqd2':
      const totalDose = parseFloat(values.totalDose);
      const fractionsNumber = parseFloat(values.fractionsNumber);
      const alphabeta = parseFloat(values.alphabeta);
      return calculateEQD2(totalDose, fractionsNumber, alphabeta).toFixed(1) + ' Gy';
    
    // Add more calculator implementations
    
    default:
      throw new Error(`Calculator ${calculatorId} not implemented`);
  }
}
