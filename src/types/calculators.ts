export interface GeneExpressionData {
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

export interface RecurrenceScoreResult {
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

export interface CalculatorType {
  id: string;
  name: string;
  description: string;
}

export interface CalculatorCategory {
  id: string;
  name: string;
  calculators: CalculatorType[];
}
