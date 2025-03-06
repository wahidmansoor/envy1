/// <reference types="jest" />

import type { GeneExpressionData } from '../../../types/calculators';
import { calculateBreastCancerRecurrenceScore } from '../oncotype';

const baselineGeneData: GeneExpressionData = {
  // Reference genes
  ACTB: 1.0,
  GAPDH: 1.0,
  RPLPO: 1.0,
  GUS: 1.0,
  TFRC: 1.0,

  // Proliferation group
  Ki67: 1.0,
  STK15: 1.0,
  Survivin: 1.0,
  CCNB1: 1.0,
  MYBL2: 1.0,

  // Invasion group
  MMP11: 1.0,
  CTSL2: 1.0,

  // HER2 group
  GRB7: 1.0,
  HER2: 1.0,

  // Estrogen group
  ER: 1.0,
  PGR: 1.0,
  BCL2: 1.0,
  SCUBE2: 1.0
};

describe('Oncotype DX Calculator', () => {
  it('calculates baseline score with neutral values', () => {
    const result = calculateBreastCancerRecurrenceScore(baselineGeneData);
    expect(result).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('throws error for invalid gene expression values', () => {
    const invalidData = { ...baselineGeneData, Ki67: -1 };
    expect(() => calculateBreastCancerRecurrenceScore(invalidData)).toThrow();
  });

  it('throws error for missing gene expression values', () => {
    const incompleteData = { ...baselineGeneData } as Partial<GeneExpressionData>;
    delete incompleteData.Ki67;
    expect(() => 
      calculateBreastCancerRecurrenceScore(incompleteData as GeneExpressionData)
    ).toThrow();
  });

  it('correctly identifies low risk cases', () => {
    const lowRiskData: GeneExpressionData = {
      ...baselineGeneData,
      Ki67: 0.5,
      STK15: 0.4,
      Survivin: 0.3,
      CCNB1: 0.4,
      MYBL2: 0.5
    };
    const result = calculateBreastCancerRecurrenceScore(lowRiskData);
    expect(result.riskGroup).toBe('Low');
    expect(result.score).toBeLessThan(18);
  });

  it('correctly identifies high risk cases', () => {
    const highRiskData: GeneExpressionData = {
      ...baselineGeneData,
      Ki67: 2.5,
      STK15: 2.2,
      Survivin: 2.4,
      CCNB1: 2.3,
      MYBL2: 2.1,
      HER2: 2.0,
      GRB7: 2.0
    };
    const result = calculateBreastCancerRecurrenceScore(highRiskData);
    expect(result.riskGroup).toBe('High');
    expect(result.score).toBeGreaterThan(30);
  });

  it('provides valid confidence intervals', () => {
    const result = calculateBreastCancerRecurrenceScore(baselineGeneData);
    expect(result.confidence).toBeDefined();
    expect(result.confidence.interval[0]).toBeLessThan(result.score);
    expect(result.confidence.interval[1]).toBeGreaterThan(result.score);
    expect(result.confidence.level).toBe(0.95);
  });
});