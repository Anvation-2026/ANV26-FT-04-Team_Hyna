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

export const BUSINESSES_DATA: BusinessEntity[] = [
  {
    id: "GT-2026-00124",
    key: "apex",
    name: "Apex Industrial Supplies",
    industry: "Industrial Equipment & Tools",
    reg: "REG-48291",
    address: "24 Industrial Estate Road, Peenya, Bengaluru",
    city: "Bengaluru",
    coordinates: {
      lat: 13.0312,
      lng: 77.5186
    },
    score: 87,
    classification: "Credible",
    risk: "Low",
    status: "Reviewed",
    updated: "10 min ago",
    explanation: "Strong supporting evidence across registry, utility, and municipal cadastral sources. High spatial concordance with verified industrial estate boundaries.",
    supportingCount: 5,
    contradictionCount: 1,
    sourceCount: 4,
    signals: [
      { name: "Registry consistency", result: "Supported", contribution: "+18", source: "MCA & GST Master Registry", type: "success" },
      { name: "Location activity", result: "Supported", contribution: "+15", source: "Utility & Industrial Grid Telemetry", type: "success" },
      { name: "Address uniqueness", result: "Supported", contribution: "+12", source: "Municipal GIS Cadastre", type: "success" },
      { name: "Geographic consistency", result: "Supported", contribution: "+14", source: "Physical Cluster Corroboration", type: "success" },
      { name: "Transaction-like activity", result: "Supported", contribution: "+16", source: "Commercial Logistics Footprint", type: "success" },
      { name: "Address Formatting Syntax", result: "Minor", contribution: "-8", source: "Cross-signal Syntax Check", type: "danger" }
    ],
    locationSummary: {
      claimed: "24 Industrial Estate Road, Peenya, Bengaluru",
      nearestCluster: "420 m (Peenya Phase 1 Cluster)",
      related: "3 verified branches",
      shared: "2 single-tenant adjacent lots",
      clusterCoords: { lat: 13.0325, lng: 77.5198 }
    },
    contradictions: [
      {
        title: "Address Formatting Syntax",
        severity: "Low",
        desc: "Sub-plot identifier '24-B' differs slightly from master plot indexing '24' in historical deed register.",
        impact: "-8"
      }
    ]
  },
  {
    id: "GT-2026-00084",
    key: "nova",
    name: "Nova Trading Network",
    industry: "Bulk Maritime Commodities",
    reg: "REG-11920",
    address: "14 North Harbour Road, Port Trust Area, Chennai",
    city: "Chennai",
    coordinates: {
      lat: 13.0924,
      lng: 80.2974
    },
    score: 28,
    classification: "Suspicious",
    risk: "High",
    status: "Under Review",
    updated: "24 min ago",
    attentionReason: "Location activity mismatch",
    attentionRisk: "High",
    explanation: "Suspicious location pattern. Activity concentration is displaced 3.2 km from claimed maritime address with multiple overlapping high-risk shell business registrations.",
    supportingCount: 1,
    contradictionCount: 4,
    sourceCount: 3,
    signals: [
      { name: "Registry consistency", result: "Mixed", contribution: "+8", source: "Registrar Data Check", type: "warning" },
      { name: "Location activity", result: "Contradiction", contribution: "-24", source: "Port Telemetry & Power Logs", type: "danger" },
      { name: "Address uniqueness", result: "Contradiction", contribution: "-18", source: "Municipal Building Register", type: "danger" },
      { name: "Geographic consistency", result: "Contradiction", contribution: "-14", source: "Geocoding Triangulation", type: "danger" },
      { name: "Transaction-like activity", result: "Mixed", contribution: "+6", source: "Logistics Waybill Cross-Check", type: "warning" },
      { name: "Entity Cluster Concentration", result: "Contradiction", contribution: "-16", source: "Shared Shell Entity Network", type: "danger" }
    ],
    locationSummary: {
      claimed: "14 North Harbour Road, Port Trust Area, Chennai",
      nearestCluster: "3.2 km (True activity localized near Royapuram)",
      related: "1 shell affiliate",
      shared: "12 unverified entities at same pin",
      clusterCoords: { lat: 13.1115, lng: 80.2880 }
    },
    contradictions: [
      {
        title: "Address Activity Mismatch",
        severity: "High",
        desc: "Physical cargo and telemetric activity is concentrated 3.2 km away from claimed customs postal premises.",
        impact: "-24"
      },
      {
        title: "Shared Address Footprint",
        severity: "High",
        desc: "Over 12 unrelated commercial shell entities share identical 150 sq. ft. room without partition.",
        impact: "-16"
      },
      {
        title: "Absence of Utility Signature",
        severity: "Medium",
        desc: "Three-phase industrial power draw remains below residential baseline during claimed operational hours.",
        impact: "-10"
      }
    ]
  },
  {
    id: "GT-2026-00099",
    key: "vertex",
    name: "Vertex Solutions",
    industry: "IT & Managed Cloud Services",
    reg: "REG-33418",
    address: "Cyber Heights, 4th Floor, HITEC City, Hyderabad",
    city: "Hyderabad",
    coordinates: {
      lat: 17.4474,
      lng: 78.3762
    },
    score: 58,
    classification: "Ambiguous",
    risk: "Medium",
    status: "Reviewed",
    updated: "1 hr ago",
    attentionReason: "Shared location",
    attentionRisk: "Medium",
    explanation: "Ambiguous location pattern. Claimed commercial premises corresponds to a multi-tenant co-working facility with shared corporate reception and aggregate IP telemetry.",
    supportingCount: 3,
    contradictionCount: 2,
    sourceCount: 3,
    signals: [
      { name: "Registry consistency", result: "Supported", contribution: "+15", source: "MCA Corporate Registry", type: "success" },
      { name: "Location activity", result: "Mixed", contribution: "+6", source: "Telecom & Cloud IP Corroboration", type: "warning" },
      { name: "Address uniqueness", result: "Mixed", contribution: "-10", source: "Co-working Space Registry", type: "warning" },
      { name: "Geographic consistency", result: "Supported", contribution: "+12", source: "Cyberabad Tech Corridor GIS", type: "success" },
      { name: "Commercial Telemetry", result: "Mixed", contribution: "+8", source: "Aggregated Building Log", type: "warning" },
      { name: "Multi-tenant Footprint", result: "Minor", contribution: "-6", source: "Shared Reception Footprint", type: "danger" }
    ],
    locationSummary: {
      claimed: "Cyber Heights, 4th Floor, Suite 402, HITEC City, Hyderabad",
      nearestCluster: "180 m (HITEC Hub Core)",
      related: "8 partner entities",
      shared: "6 independent ventures at shared reception",
      clusterCoords: { lat: 17.4485, lng: 78.3775 }
    },
    contradictions: [
      {
        title: "Shared Address Co-working Flag",
        severity: "Medium",
        desc: "Co-working membership verification lacks exclusive tenancy lease and physical door signage.",
        impact: "-10"
      },
      {
        title: "Shared Telemetry Signature",
        severity: "Low",
        desc: "Network gateway bandwidth shared across multiple tenant accounts.",
        impact: "-6"
      }
    ]
  },
  {
    id: "GT-2026-00118",
    key: "precision",
    name: "Precision Die & Castings",
    industry: "Heavy Metal Fabrication",
    reg: "REG-78234",
    address: "Plot 22 Peenya 1st Stage, Bengaluru",
    city: "Bengaluru",
    coordinates: {
      lat: 13.0285,
      lng: 77.5140
    },
    score: 84,
    classification: "Credible",
    risk: "Low",
    status: "Reviewed",
    updated: "3 hrs ago",
    explanation: "Strong supporting evidence. Heavy manufacturing footprint verified via consistent high-voltage industrial draw and factory inspectorate records.",
    supportingCount: 5,
    contradictionCount: 1,
    sourceCount: 4,
    signals: [
      { name: "Registry consistency", result: "Supported", contribution: "+17", source: "MCA Factory Registry", type: "success" },
      { name: "Location activity", result: "Supported", contribution: "+16", source: "Industrial Substation Metering", type: "success" },
      { name: "Address uniqueness", result: "Supported", contribution: "+13", source: "KIADB Plot Cadastre", type: "success" },
      { name: "Geographic consistency", result: "Supported", contribution: "+14", source: "Industrial Corridor Mapping", type: "success" },
      { name: "Heavy Freight Corroboration", result: "Supported", contribution: "+14", source: "E-Way Bill Toll Crossing", type: "success" },
      { name: "Minor Gate Re-numbering", result: "Minor", contribution: "-6", source: "Municipal Gate Re-indexing", type: "danger" }
    ],
    locationSummary: {
      claimed: "Plot 22 Peenya 1st Stage, Bengaluru",
      nearestCluster: "310 m (Peenya Engineering Zone)",
      related: "2 foundry sites",
      shared: "0 shared tenancies",
      clusterCoords: { lat: 13.0290, lng: 77.5152 }
    },
    contradictions: [
      {
        title: "Minor Gate Indexing Variance",
        severity: "Low",
        desc: "Gate 2 designated as dispatch entrance while cadastral deed references Main Gate 1.",
        impact: "-6"
      }
    ]
  },
  {
    id: "GT-2026-00077",
    key: "global_marine",
    name: "Global Marine Impex",
    industry: "Maritime Import & Export",
    reg: "REG-55600",
    address: "Customs Gate 3 Byway, Harbour Zone, Chennai",
    city: "Chennai",
    coordinates: {
      lat: 13.0845,
      lng: 80.2910
    },
    score: 22,
    classification: "Suspicious",
    risk: "High",
    status: "Under Review",
    updated: "5 hrs ago",
    attentionReason: "Weak location evidence",
    attentionRisk: "High",
    explanation: "Suspicious location pattern. Claimed customs warehouse address lacks active port gate entry telemetry and exhibits zero freight movement across monitored berths.",
    supportingCount: 1,
    contradictionCount: 5,
    sourceCount: 2,
    signals: [
      { name: "Registry consistency", result: "Mixed", contribution: "+6", source: "Directorate of Foreign Trade", type: "warning" },
      { name: "Location activity", result: "Contradiction", contribution: "-26", source: "Chennai Port Trust Gate Access", type: "danger" },
      { name: "Address uniqueness", result: "Contradiction", contribution: "-18", source: "Harbour Berth Cadastre", type: "danger" },
      { name: "Geographic consistency", result: "Contradiction", contribution: "-16", source: "Customs Zone Surveillance", type: "danger" },
      { name: "Container Movement", result: "Contradiction", contribution: "-14", source: "Container Terminal Log", type: "danger" },
      { name: "Entity Cross-Ownership", result: "Contradiction", contribution: "-10", source: "Sanctions & High-Risk Cross-Match", type: "danger" }
    ],
    locationSummary: {
      claimed: "Customs Gate 3 Byway, Harbour Zone, Chennai",
      nearestCluster: "4.8 km (No maritime operations detected)",
      related: "0 active depots",
      shared: "8 dormant forwarding mailboxes",
      clusterCoords: { lat: 13.0890, lng: 80.2850 }
    },
    contradictions: [
      {
        title: "Zero Port Telemetry",
        severity: "High",
        desc: "No electronic container seal or cargo manifest logged at Port Gate 3 during last 180 days.",
        impact: "-26"
      },
      {
        title: "Dormant Forwarding Box",
        severity: "High",
        desc: "Premises verified as unattended receipt box inside shared clearing agent shed.",
        impact: "-18"
      }
    ]
  },
  {
    id: "GT-2026-00103",
    key: "kaveri",
    name: "Kaveri Agro Logistics",
    industry: "Agricultural Supply Chain & Storage",
    reg: "REG-20181",
    address: "Survey 18 Doddaballapura Industrial Area, Bengaluru",
    city: "Bengaluru",
    coordinates: {
      lat: 13.2922,
      lng: 77.5431
    },
    score: 54,
    classification: "Ambiguous",
    risk: "Medium",
    status: "Reviewed",
    updated: "Yesterday",
    attentionReason: "Shared location",
    attentionRisk: "Medium",
    explanation: "Ambiguous location pattern. Cold storage facility is sub-leased within an agrarian multi-crop logistics park with communal weighbridges and fluctuating seasonal occupancy.",
    supportingCount: 3,
    contradictionCount: 2,
    sourceCount: 3,
    signals: [
      { name: "Registry consistency", result: "Supported", contribution: "+14", source: "APMC & State Warehousing Board", type: "success" },
      { name: "Location activity", result: "Mixed", contribution: "+8", source: "Seasonal Grain Influx Telemetry", type: "warning" },
      { name: "Address uniqueness", result: "Mixed", contribution: "-12", source: "Revenue Survey 18 Sub-divisions", type: "warning" },
      { name: "Geographic consistency", result: "Supported", contribution: "+12", source: "Rural Logistics Corridor GIS", type: "success" },
      { name: "Weighbridge Corroboration", result: "Mixed", contribution: "+6", source: "Shared Agrarian Terminal Scale", type: "warning" },
      { name: "Shared Warehouse Boundary", result: "Minor", contribution: "-6", source: "Undivided Common Lot Agreement", type: "danger" }
    ],
    locationSummary: {
      claimed: "Survey 18 Doddaballapura Industrial Area, Bengaluru",
      nearestCluster: "240 m (Doddaballapura Agri Hub)",
      related: "4 seasonal silos",
      shared: "5 co-located commodity aggregators",
      clusterCoords: { lat: 13.2935, lng: 77.5448 }
    },
    contradictions: [
      {
        title: "Seasonal Inactivity Gap",
        severity: "Medium",
        desc: "Three consecutive months of minimal electrical draw during off-harvest cycles.",
        impact: "-12"
      },
      {
        title: "Shared Weighbridge Registry",
        severity: "Low",
        desc: "Weigh tickets issued under parent park entity rather than specific business registration.",
        impact: "-6"
      }
    ]
  }
];

export const DEMO_ANALYTICS = {
  distribution: {
    credible: 10,
    ambiguous: 8,
    suspicious: 6,
    total: 24
  },
  activity: [
    { day: "Monday", count: 4, label: "Mon" },
    { day: "Tuesday", count: 7, label: "Tue" },
    { day: "Wednesday", count: 5, label: "Wed" },
    { day: "Thursday", count: 8, label: "Thu" },
    { day: "Friday", count: 6, label: "Fri" },
    { day: "Saturday", count: 9, label: "Sat" },
    { day: "Sunday", count: 7, label: "Sun" }
  ]
};
