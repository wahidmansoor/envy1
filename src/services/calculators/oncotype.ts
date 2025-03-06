interface GeneExpressionData {
  // Reference genes
  ACTB: number;   // Beta-actin
  GAPDH: number;  // Glyceraldehyde-3-phosphate dehydrogenase
  RPLPO: number;  // Ribosomal protein, large, P0
  GUS: number;    // Beta-glucuronidase
  TFRC: number;   // Transferrin receptor

  // Proliferation group
  Ki67: number;   // Ki-67
  STK15: number;  // Aurora kinase A
  Survivin: number;
  CCNB1: number; // Cyclin B1
  MYBL2: number; // MYB proto-oncogene like 2

  // Invasion group
  MMP11: number; // Matrix metallopeptidase 11
  CTSL2: number; // Cathepsin L2

  // HER2 group
  GRB7: number;  // Growth factor receptor bound protein 7
  HER2: number;  // Human epidermal growth factor receptor 2

  // Estrogen group
  ER: number;    // Estrogen receptor 1
  PGR: number;   // Progesterone receptor
  BCL2: number;  // BCL2 apoptosis regulator
  SCUBE2: number; // Signal peptide, CUB domain and EGF like domain containing 2
}

interface RecurrenceScoreResult {
  score: number;
  riskGroup: 'Low' | 'Intermediate' | 'High';
  groupRanges: {
    low: string;
    intermediate: string;
    high: string;
  };
  subscores: {
    proliferationScore: number;
    invasionScore: number;
    HER2Score: number;
    estrogenScore: number;
    referenceScore: number;
  };
  confidence: {
    interval: [number, number];
    level: number;
  };
}

/**
 * Calculates the Breast Cancer Recurrence Score (Oncotype DX)
 * Based on the 21-gene expression assay algorithm
 * Reference: Paik S, et al. N Engl J Med 2004;351:2817-26
 */
export function calculateBreastCancerRecurrenceScore(
  data: GeneExpressionData
): RecurrenceScoreResult {
  // 1. Normalize gene expression values using reference genes
  const referenceScore = calculateReferenceScore(data);
  const normalizedData = normalizeGeneExpressionData(data, referenceScore);

  // 2. Calculate group scores
  const proliferationScore = calculateProliferationScore(normalizedData);
  const invasionScore = calculateInvasionScore(normalizedData);
  const HER2Score = calculateHER2Score(normalizedData);
  const estrogenScore = calculateEstrogenScore(normalizedData);

  // 3. Calculate unscaled recurrence score
  const unscaledRS = (
    0.47 * proliferationScore +
    0.28 * HER2Score +
    0.13 * estrogenScore +
    0.12 * invasionScore
  );

  // 4. Scale the recurrence score (0-100)
  const score = Math.min(Math.max(Math.round(20 * (unscaledRS + 6.7)), 0), 100);

  // 5. Determine risk group
  const riskGroup = determineRiskGroup(score);

  // 6. Calculate confidence interval
  const confidence = calculateConfidenceInterval(score, data);

  return {
    score,
    riskGroup,
    groupRanges: {
      low: '0-17',
      intermediate: '18-30',
      high: '31-100'
    },
    subscores: {
      proliferationScore,
      invasionScore,
      HER2Score,
      estrogenScore,
      referenceScore
    },
    confidence
  };
}

function calculateReferenceScore(data: GeneExpressionData): number {
  return (
    (data.ACTB + data.GAPDH + data.RPLPO + data.GUS + data.TFRC) / 5
  );
}

function normalizeGeneExpressionData(
  data: GeneExpressionData,
  referenceScore: number
): GeneExpressionData {
  const normalized = { ...data };
  Object.keys(data).forEach(key => {
    normalized[key as keyof GeneExpressionData] = 
      data[key as keyof GeneExpressionData] / referenceScore;
  });
  return normalized;
}

function calculateProliferationScore(data: GeneExpressionData): number {
  return (
    (data.Ki67 + data.STK15 + data.Survivin + data.CCNB1 + data.MYBL2) / 5
  );
}

function calculateInvasionScore(data: GeneExpressionData): number {
  return (data.MMP11 + data.CTSL2) / 2;
}

function calculateHER2Score(data: GeneExpressionData): number {
  return (data.GRB7 + data.HER2) / 2;
}

function calculateEstrogenScore(data: GeneExpressionData): number {
  return (
    (data.ER + data.PGR + data.BCL2 + data.SCUBE2) / 4
  );
}

function determineRiskGroup(score: number): 'Low' | 'Intermediate' | 'High' {
  if (score <= 17) return 'Low';
  if (score <= 30) return 'Intermediate';
  return 'High';
}

function calculateConfidenceInterval(
  score: number,
  data: GeneExpressionData
): { interval: [number, number]; level: number } {
  // Standard error calculation based on gene expression variability
  const standardError = Math.sqrt(
    Object.values(data).reduce((sum, value) => sum + Math.pow(value * 0.05, 2), 0)
  );

  // 95% confidence interval
  const margin = 1.96 * standardError;
  return {
    interval: [
      Math.max(0, Math.round(score - margin)),
      Math.min(100, Math.round(score + margin))
    ],
    level: 0.95 // 95% confidence level
  };
}