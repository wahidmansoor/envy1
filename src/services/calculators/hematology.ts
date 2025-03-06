interface PatientRiskFactors {
  activeBleed: boolean;
  priorBleed: boolean;
  fever: boolean;
  sepsis: boolean;
  acuteGVHD: boolean;
  mucositis: boolean;
  recentSurgery: boolean;
  coagulopathy: boolean;
  renalFailure: boolean;
  hepaticDysfunction: boolean;
  anticoagulation: boolean;
  rapidPlateletConsumption: boolean;
}

interface PatientCondition {
  diagnosis: 'Acute Leukemia' | 'Solid Tumor' | 'Autologous HSCT' | 'Allogeneic HSCT' | 'Other';
  procedureType?: 'Minor' | 'Major Surgery' | 'CNS Surgery' | 'Lumbar Puncture' | 'None';
  isStable: boolean;
  currentPlateletCount: number;
  recentPlateletResponse?: number;
  refractoriness?: boolean;
}

interface TransfusionThreshold {
  prophylacticThreshold: number;
  therapeuticThreshold: number;
  recommendedDose: string;
  additionalConsiderations: string[];
  urgency: 'Routine' | 'Urgent' | 'Emergency';
}

/**
 * Calculates the platelet transfusion threshold based on patient risk factors and condition
 * References:
 * 1. ASCO Platelet Transfusion Guidelines
 * 2. British Committee for Standards in Haematology Guidelines
 * 3. International Society of Blood Transfusion Guidelines
 */
export function calculatePlateletTransfusionThreshold(
  riskFactors: PatientRiskFactors,
  condition: PatientCondition
): TransfusionThreshold {
  let prophylacticThreshold = 10; // Base threshold (×10⁹/L)
  let therapeuticThreshold = 50; // Base therapeutic threshold
  const considerations: string[] = [];

  // Adjust for active bleeding or high-risk conditions
  if (riskFactors.activeBleed) {
    therapeuticThreshold = 100;
    considerations.push('Maintain platelet count >100×10⁹/L due to active bleeding');
  }

  // Adjust for procedure type
  switch (condition.procedureType) {
    case 'Minor':
      therapeuticThreshold = Math.max(therapeuticThreshold, 50);
      considerations.push('Maintain >50×10⁹/L for minor procedures');
      break;
    case 'Major Surgery':
      therapeuticThreshold = Math.max(therapeuticThreshold, 80);
      considerations.push('Maintain >80×10⁹/L for major surgery');
      break;
    case 'CNS Surgery':
      therapeuticThreshold = Math.max(therapeuticThreshold, 100);
      considerations.push('Maintain >100×10⁹/L for CNS procedures');
      break;
    case 'Lumbar Puncture':
      therapeuticThreshold = Math.max(therapeuticThreshold, 50);
      considerations.push('Maintain >50×10⁩/L for lumbar puncture');
      break;
  }

  // Adjust prophylactic threshold based on risk factors
  if (riskFactors.fever || riskFactors.sepsis) {
    prophylacticThreshold = Math.max(prophylacticThreshold, 20);
    considerations.push('Higher threshold due to fever/sepsis');
  }

  if (riskFactors.coagulopathy || riskFactors.anticoagulation) {
    prophylacticThreshold = Math.max(prophylacticThreshold, 20);
    considerations.push('Higher threshold due to coagulopathy/anticoagulation');
  }

  if (riskFactors.acuteGVHD || riskFactors.mucositis) {
    prophylacticThreshold = Math.max(prophylacticThreshold, 20);
    considerations.push('Higher threshold due to GVHD/mucositis');
  }

  // Special considerations for specific diagnoses
  switch (condition.diagnosis) {
    case 'Acute Leukemia':
      if (!condition.isStable) {
        prophylacticThreshold = Math.max(prophylacticThreshold, 20);
        considerations.push('Higher threshold for unstable acute leukemia');
      }
      break;
    case 'Allogeneic HSCT':
      if (riskFactors.acuteGVHD) {
        prophylacticThreshold = Math.max(prophylacticThreshold, 20);
        considerations.push('Higher threshold during acute GVHD');
      }
      break;
  }

  // Determine recommended dose
  let recommendedDose = 'Single adult dose (typically 1 unit of apheresis platelets)';
  if (condition.refractoriness) {
    recommendedDose = 'Consider HLA-matched platelets';
    considerations.push('Platelet refractoriness present - monitor response');
  }
  if (riskFactors.rapidPlateletConsumption) {
    recommendedDose += ' - may require more frequent transfusions';
  }

  // Determine urgency
  let urgency: TransfusionThreshold['urgency'] = 'Routine';
  if (riskFactors.activeBleed || condition.procedureType === 'CNS Surgery') {
    urgency = 'Emergency';
  } else if (condition.currentPlateletCount < prophylacticThreshold / 2) {
    urgency = 'Urgent';
  }

  // Add monitoring recommendations
  if (condition.recentPlateletResponse !== undefined && condition.recentPlateletResponse < 10) {
    considerations.push('Poor increment with recent transfusion - investigate cause');
  }

  if (riskFactors.renalFailure || riskFactors.hepaticDysfunction) {
    considerations.push('Monitor closely due to organ dysfunction');
  }

  return {
    prophylacticThreshold,
    therapeuticThreshold,
    recommendedDose,
    additionalConsiderations: considerations,
    urgency
  };
}

/**
 * Calculate post-transfusion platelet increment
 */
export function calculatePlateletIncrement(
  prePlateletCount: number,
  postPlateletCount: number,
  bodySurfaceArea: number
): number {
  return ((postPlateletCount - prePlateletCount) * bodySurfaceArea) / 100000;
}

/**
 * Determine if patient is refractory to platelet transfusions
 * Based on 1-hour post-transfusion increment < 7.5 × 10⁹/L
 * or 24-hour increment < 4.5 × 10⁹/L on two consecutive occasions
 */
export function isPlateletRefractory(
  oneHourIncrements: number[],
  twentyFourHourIncrements: number[]
): boolean {
  if (oneHourIncrements.length >= 2) {
    const lastTwo = oneHourIncrements.slice(-2);
    if (lastTwo.every(inc => inc < 7.5)) return true;
  }

  if (twentyFourHourIncrements.length >= 2) {
    const lastTwo = twentyFourHourIncrements.slice(-2);
    if (lastTwo.every(inc => inc < 4.5)) return true;
  }

  return false;
}
