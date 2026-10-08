export interface BusinessSignal {
  name: string;
  result: string;
  contribution: string;
  source: string;
  type: 'success' | 'warning' | 'danger';
}

export interface ContradictionItem {
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  desc: string;
  impact: string;
}

export interface BusinessEntity {
  id: string;
  key: 'apex' | 'nova' | 'vertex' | 'precision' | 'global_marine' | 'kaveri';
  name: string;
  industry: string;
  reg: string;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  score: number;
  classification: 'Credible' | 'Ambiguous' | 'Suspicious';
  risk: 'Low' | 'Medium' | 'High';
  status: 'Reviewed' | 'Under Review';
  updated: string;
  attentionReason?: string;
  attentionRisk?: 'Low' | 'Medium' | 'High';
  explanation: string;
  supportingCount: number;
  contradictionCount: number;
  sourceCount: number;
  signals: BusinessSignal[];
  locationSummary: {
    claimed: string;
    nearestCluster: string;
    related: string;
    shared: string;
    clusterCoords?: { lat: number; lng: number };
    sharedCoords?: { lat: number; lng: number }[];
  };
  contradictions: ContradictionItem[];
}

export const BUSINESSES_DATA: BusinessEntity[] = [];
