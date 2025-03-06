// Function to calculate Body Surface Area (BSA) using the Du Bois formula
export const calculateBSA = (height: number, weight: number): number => {
  // Convert height from centimeters to meters
  const heightInMeters = height / 100;
  // Du Bois formula
  return 0.007184 * Math.pow(heightInMeters, 0.725) * Math.pow(weight, 0.425);
};

// Function to calculate Carboplatin Dose using the Calvert formula
export const calculateCarboplatinDose = (targetAUC: number, gfr: number): number => {
  return targetAUC * (gfr + 25);
};



// Function to calculate Creatinine Clearance using the Cockcroft-Gault equation
export const calculateCreatinineClearance = (
  creatinine: number,
  weight: number,
  age: number,
  sex: 'male' | 'female'
): number => {
  const constant = sex === 'male' ? 140 : 144;
  return ((constant - age) * weight) / (72 * creatinine);
};

// Function to calculate the estimated glomerular filtration rate (eGFR) using the CKD-EPI equation
export const calculateEGFR = (
  creatinine: number,
  age: number,
  sex: 'male' | 'female'
): number => {
  const constant = sex === 'male' ? 141 : 144;
  const coefficient = sex === 'male' ? 1.209 : 1.018;
  const exponent = sex === 'male' ? -0.411 : -0.329;
  return (
    (constant * Math.pow(creatinine, -1.154) * Math.pow(age, exponent) * coefficient)
  );
};

// Function to calculate the Biologically Effective Dose (BED)
export const calculateBED = (dose: number, fractionSize: number, alphaBetaRatio: number): number => {
  return dose * (1 + fractionSize / alphaBetaRatio);
};

// Function to calculate the Equivalent Dose in 2 Gy Fractions (EQD2)
export const calculateEQD2 = (dose: number, fractionSize: number, alphaBetaRatio: number): number => {
  return dose * (fractionSize + alphaBetaRatio) / (2 + alphaBetaRatio);
};

// Function to calculate the Absolute Neutrophil Count (ANC)
export const calculateANC = (totalWhiteBloodCells: number, neutrophils: number, bands: number): number => {
  return totalWhiteBloodCells * (neutrophils + bands) / 100;
};

// Function to calculate the Febrile Neutropenia Risk Score (MASCC Score)
export const calculateMASCCScore = (
  platelets: number,
  hypotension: boolean,
  tachypnea: boolean,
  disease: 'hematologic' | 'solid_tumor' | 'both'
): number => {
  const hypotensionPoints = hypotension ? 10 : 0;
  const tachypneaPoints = tachypnea ? 30 : 0;
  const diseasePoints = disease === 'hematologic' ? 11 : disease === 'solid_tumor' ? 6 : 4;
  return 90 - (7 * platelets) - hypotensionPoints - tachypneaPoints - diseasePoints;
};

// Function to calculate the corrected calcium level
export const calculateCorrectedCalcium = (totalCalcium: number, albumin: number): number => {
  return totalCalcium + 0.8 * (4 - albumin);
};

// Function to calculate the corrected sodium level
export const calculateCorrectedSodium = (sodium: number, glucose: number): number => {
  return sodium + 1.6 * (glucose - 100) / 100;
};

// Function to calculate the Khorana score
export const calculateKhoranaScore = (
  platelets: number,
  hemoglobin: number,
  leukocytes: number,
  bmi: number,
  metastases: boolean
): number => {
  return (platelets >= 350000 ? 1 : 0) + (hemoglobin < 10 ? 1 : 0) + (leukocytes > 11000 ? 1 : 0) + (bmi >= 35 ? 1 : 0) + (metastases ? 1 : 0);
};

// Function to calculate the HAS-BLED score
export const calculateHASBLEDScore = (
  hypertension: boolean,
  renalDisease: boolean,
  liverDisease: boolean,
  stroke: boolean,
  bleeding: boolean,
  labileINR: boolean,
  age: number,
  drugsOrAlcohol: boolean
): number => {
  return (hypertension ? 1 : 0) + (renalDisease ? 1 : 0) + (liverDisease ? 1 : 0) + (stroke ? 1 : 0) + (bleeding ? 1 : 0) + (labileINR ? 1 : 0) + (age >= 65 ? 1 : 0) + (drugsOrAlcohol ? 1 : 0);
};

// Function to calculate the Palliative Performance Scale (PPS) score
export const calculatePPSScore = (
  activity: number,
  mobility: number,
  selfCare: number,
  diet: number,
  ambulation: number,
  symptoms: number
): number => {
  return activity + mobility + selfCare + diet + ambulation + symptoms;
};

// Function to calculate the Palliative Prognostic Score (PaP)
export const calculatePaPScore = (
  performanceStatus: number,
  weightLoss: number,
  age: number,
  comorbidities: number
): number => {
  return performanceStatus + weightLoss + age + comorbidities;
};

// Function to calculate the Glasgow Prognostic Score (GPS)
export const calculateGPSScore = (
  albumin: number,
  bilirubin: number,
  age: number,
  neutrophils: number
): number => {
  return albumin + bilirubin + age + neutrophils;
};

// Define valid opioid types
type OpioidType = 'Morphine' | 'Oxycodone' | 'Hydromorphone' | 'Fentanyl';

// Define the equianalgesic table type
const equianalgesicTable: Record<OpioidType, number> = {
  'Morphine': 1,
  'Oxycodone': 1.5,
  'Hydromorphone': 7,
  'Fentanyl': 75
};

// Function to calculate the Opioid Equianalgesic Dose
export const calculateOpioidEquianalgesicDose = (
  originalDose: number,
  originalOpioid: OpioidType,
  targetOpioid: OpioidType
): number => {
  return originalDose * (equianalgesicTable[targetOpioid] / equianalgesicTable[originalOpioid] || 1);
};

// Function to calculate the total dose of doxorubicin
export const calculateDoxorubicinDose = (
  cumulativeDose: number,
  maxCumulativeDose: number
): number => {
  return maxCumulativeDose - cumulativeDose;
};

// Function to calculate the linear-quadratic (LQ) model
export const calculateLQModel = (dose: number, fractionSize: number, alpha: number, beta: number): number => {
  return alpha * dose + beta * dose * dose;
};

// Function to calculate the International Prognostic Index (IPI) for Lymphoma
export const calculateIPI = (age: number, stage: number, lactateDehydrogenase: number, performanceStatus: number, extranodalSites: number): number => {
  return age + stage + lactateDehydrogenase + performanceStatus + extranodalSites;
};

// Function to calculate the Revised International Prognostic Index (R-IPI) for Lymphoma
export const calculateRIPI = (age: number, stage: number, lactateDehydrogenase: number, performanceStatus: number, extranodalSites: number): number => {
  return age + stage + lactateDehydrogenase + performanceStatus + extranodalSites;
};

// Function to calculate the Breast Cancer Recurrence Score (Oncotype DX)
export const calculateBreastCancerRecurrenceScore = (geneExpressionData: any): number => {
  // This is a placeholder, requires actual gene expression data and algorithm
  return 0;
};

// Function to calculate the MELD score
export const calculateMELDScore = (bilirubin: number, creatinine: number, INR: number, sodium: number): number => {
  return 3.78 * Math.log10(bilirubin) + 11.2 * Math.log10(creatinine) + 9.57 * Math.log10(INR) - 6.43 * Math.log10(sodium) + 3.8;
};

// Function to calculate the Child-Pugh score
export const calculateChildPughScore = (
  bilirubin: number,
  albumin: number,
  INR: number,
  ascites: boolean,
  encephalopathy: boolean
): number => {
  let score = 0;
  score += bilirubin >= 2 ? 2 : bilirubin >= 1.2 ? 1 : 0;
  score += albumin <= 3.5 ? 2 : albumin <= 3 ? 1 : 0;
  score += INR >= 1.7 ? 2 : INR >= 1.5 ? 1 : 0;
  score += ascites ? 1 : 0;
  score += encephalopathy ? 2 : 0;
  return score;
};

// Function to calculate the Gleason score
export const calculateGleasonScore = (primaryPattern: number, secondaryPattern: number): number => {
  return primaryPattern + secondaryPattern;
};

// Function to calculate the MSKCC nomograms
export const calculateMSKCCNomograms = (data: any): number => {
  // This is a placeholder, requires actual data and algorithm
  return 0;
};

// Function to calculate the platelet transfusion threshold
export const calculatePlateletTransfusionThreshold = (plateletCount: number, riskFactors: number): number => {
  // This is a placeholder, requires a more complex algorithm
  return 0;
};

// Function to calculate the NCI CTCAE Toxicity Grading System
export const calculateNCI_CTCAE_ToxicityGrade = (grade: number): string => {
  switch (grade) {
    case 0: return 'No adverse event';
    case 1: return 'Mild adverse event';
    case 2: return 'Moderate adverse event';
    case 3: return 'Severe adverse event';
    case 4: return 'Life-threatening adverse event';
    case 5: return 'Death';
    default: return 'Unknown';
  }
};
