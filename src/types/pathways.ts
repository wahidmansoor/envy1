export interface DetailedInfo {
  when: string;
  considerations: string[];
  outcomes: string[];
  followUp: string[];
}

export interface PathwayStep {
  name: string;
  details: DetailedInfo;
}

export interface ExtendedPathwayInfo {
  diagnosticInfo: {
    title: string;
    items: string[];
  };
  clinicalTools: {
    title: string;
    items: string[];
  };
  resources: {
    title: string;
    items: string[];
  };
}

export interface ScreeningDetails {
  when: string;
  procedure: string[];
  risks: string[];
  benefits: string[];
  alternatives: string[];
}

export interface ReferralDetails {
  criteria: string[];
  immediateActions: string[];
  documentation: string[];
  followUp: string[];
}

export interface GuidelineDetails {
  evidence: string[];
  implementation: string[];
  monitoring: string[];
  updates: string[];
}
