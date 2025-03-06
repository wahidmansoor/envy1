export interface CancerPathwayDetails {
  when: string;
  considerations: string[];
  outcomes: string[];
  followUp: string[];
}

export interface EnhancedInfo {
  diagnosticTests: {
    title: string;
    items: string[];
  };
  tools: {
    title: string;
    items: string[];
  };
  resources: {
    title: string;
    items: string[];
  };
}

export interface CancerPathwayData {
  title: string;
  enhancedInfo: EnhancedInfo;
  steps: Array<{
    name: string;
    details: CancerPathwayDetails;
  }>;
}
