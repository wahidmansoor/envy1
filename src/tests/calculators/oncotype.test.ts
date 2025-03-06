import { describe, expect, it } from '@jest/globals';
import { calculateBreastCancerRecurrenceScore } from '../../services/calculators/oncotype';
import type { GeneExpressionData } from '../../types/calculators';

describe('Oncotype DX Recurrence Score Calculator', () => {
  // Sample test data based on published validation studies
  const sampleLowRiskData: GeneExpressionData = {
    // Reference genes with typical expression levels
    ACTB: 1.0,
    GAPDH: 1.0,
    RPLPO: 1.0,
    GUS: 1.0,
    TFRC: 1.0,

    // Low proliferation signature
    Ki67: 0.5,
    STK15: 0.4,
    Survivin: 0.3,
    CCNB1: 0.4,
    MYBL2: 0.5,

    // Low invasion markers
    MMP11: 0.3,
    CTSL2: 0.4,

    // Low HER2 expression
    GRB7: 0.3,
    HER2: 0.4,

    // High estrogen signaling
    ER: 2.0,
    PGR: 1.8,
    BCL2: 1.6,
    SCUBE2: 1.5
  };

  const sampleHighRiskData: GeneExpressionData = {
    // Reference genes
    ACTB: 1.0,
    GAPDH: 1.0,
    RPLPO: 1.0,
    GUS: 1.0,
    TFRC: 1.0,

    // High proliferation signature
    Ki67: 2.5,
    STK15: 2.2,
    Survivin: 2.4,
    CCNB1: 2.3,
    MYBL2: 2.1,

    // High invasion markers
    MMP11: 1.8,
    CTSL2: 1.9,

    // High HER2 expression
    GRB7: 2.1,
    HER2: 2.3,

    // Low estrogen signaling
    ER: 0.5,
    PGR: 0.4,
    BCL2: 0.6,
    SCUBE2: 0.5
  };

  it('correctly identifies low risk cases', () => {
    const result = calculateBreastCancerRecurrenceScore(sampleLowRiskData);
    expect(result.score).toBeLessThan(18);
    expect(result.riskGroup).toBe('Low');
  });

  it('correctly identifies high risk cases', () => {
    const result = calculateBreastCancerRecurrenceScore(sampleHighRiskData);
    expect(result.score).toBeGreaterThan(30);
    expect(result.riskGroup).toBe('High');
  });

  it('calculates subscores correctly', () => {
    const result = calculateBreastCancerRecurrenceScore(sampleLowRiskData);
    expect(result.subscores).toHaveProperty('proliferationScore');
    expect(result.subscores).toHaveProperty('invasionScore');
    expect(result.subscores).toHaveProperty('HER2Score');
    expect(result.subscores).toHaveProperty('estrogenScore');
  });

  it('provides valid confidence intervals', () => {
    const result = calculateBreastCancerRecurrenceScore(sampleLowRiskData);
    expect(result.confidence.interval[0]).toBeLessThan(result.score);
    expect(result.confidence.interval[1]).toBeGreaterThan(result.score);
    expect(result.confidence.level).toBe(0.95);
  });

  it('handles invalid gene expression values', () => {
    const invalidData = { ...sampleLowRiskData, Ki67: -1 };
    expect(() => calculateBreastCancerRecurrenceScore(invalidData)).toThrow();
  });

  it('handles missing gene expression values', () => {
    const incompleteData = { ...sampleLowRiskData };
    delete (incompleteData as any).Ki67;
    expect(() => calculateBreastCancerRecurrenceScore(incompleteData)).toThrow();
  });

  it('validates score ranges', () => {
    const result = calculateBreastCancerRecurrenceScore(sampleHighRiskData);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('provides consistent results for identical inputs', () => {
    const result1 = calculateBreastCancerRecurrenceScore(sampleLowRiskData);
    const result2 = calculateBreastCancerRecurrenceScore(sampleLowRiskData);
    expect(result1.score).toBe(result2.score);
  });

  // Edge cases
  it('handles borderline cases correctly', () => {
    const borderlineData = { ...sampleLowRiskData };
    Object.keys(borderlineData).forEach(key => {
      if (key !== 'ACTB') {
        (borderlineData as any)[key] = 1.0;
      }
    });
    const result = calculateBreastCancerRecurrenceScore(borderlineData);
    expect(result.score).toBeGreaterThan(17);
    expect(result.score).toBeLessThan(31);
  });
});