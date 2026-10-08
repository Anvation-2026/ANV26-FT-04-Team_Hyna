window.GEOTRUST_BUSINESSES = [
  {
    id: "INV-001",
    key: "inv-001",
    name: "Apex Industrial Supplies",
    businessName: "Apex Industrial Supplies",
    score: 87,
    classification: "Credible",
    risk: "Low",
    status: "Verified",
    address: "Plot 12, Phase 2, Industrial Area",
    city: "Bengaluru",
    updated: "2 mins ago",
    industry: "Manufacturing",
    reg: "REG-8392",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    locationSummary: { 
      clusterCoords: { lat: 12.9716, lng: 77.5946 },
      claimed: "Plot 12, Phase 2",
      nearestCluster: "0.1 km",
      related: "2 Industrial Peers",
      shared: "Unique footprint"
    },
    explanation: "Multiple independent evidence signals support the claimed trading location.",
    registryConsistency: "Strong",
    locationActivity: "Strong",
    geographicConsistency: "Strong",
    locationType: "Unique",
    contradictionLevel: "Low",
    supportingCount: 5,
    contradictionCount: 1,
    sourceCount: 4,
    signals: [
      { name: "Registry Match", type: "success", result: "Verified", contribution: "+40", source: "MCA" },
      { name: "Power Signature", type: "success", result: "Industrial", contribution: "+25", source: "Utility" },
      { name: "E-Way Bill Route", type: "success", result: "Corroborated", contribution: "+22", source: "Logistics" }
    ],
    contradictions: [
      { title: "Floor Area", desc: "Minor discrepancy in floor area registry (1% variance)." }
    ]
  },
  {
    id: "INV-002",
    key: "inv-002",
    name: "Nova Trading Network",
    businessName: "Nova Trading Network",
    score: 28,
    classification: "Suspicious Location Pattern",
    risk: "High",
    status: "Flagged",
    address: "Suite 404, Virtual Plaza",
    city: "Mumbai",
    updated: "15 mins ago",
    industry: "Wholesale",
    reg: "REG-9912",
    coordinates: { lat: 19.0760, lng: 72.8777 },
    locationSummary: { 
      clusterCoords: { lat: 19.0760, lng: 72.8777 },
      claimed: "Suite 404",
      nearestCluster: "5 km",
      related: "None",
      shared: "72 businesses"
    },
    explanation: "Independent signals show substantial inconsistencies around the claimed trading location.",
    registryConsistency: "Weak",
    locationActivity: "Weak",
    geographicConsistency: "Weak",
    locationType: "Weak",
    contradictionLevel: "High",
    supportingCount: 2,
    contradictionCount: 4,
    sourceCount: 4,
    signals: [
      { name: "Registry Match", type: "warning", result: "Found", contribution: "+10", source: "MCA" },
      { name: "Power Signature", type: "danger", result: "Residential", contribution: "-18", source: "Utility" }
    ],
    contradictions: [
      { title: "Capacity Contradiction", desc: "Claimed 50,000 sqft warehouse at residential tower coordinate." },
      { title: "Logistics Void", desc: "No heavy logistics routing in past 6 months to this node." },
      { title: "Shell Pattern", desc: "72 other registered businesses share this exact suite." },
      { title: "Tax Filing", desc: "GST returns show zero interstate movement despite wholesale claim." }
    ]
  },
  {
    id: "INV-003",
    key: "inv-003",
    name: "Vertex Solutions",
    businessName: "Vertex Solutions",
    score: 58,
    classification: "Ambiguous / Shared Location",
    risk: "Medium",
    status: "Review Required",
    address: "Level 2, Co-Work Hub",
    city: "Delhi",
    updated: "1 hour ago",
    industry: "Consulting",
    reg: "REG-5521",
    coordinates: { lat: 28.7041, lng: 77.1025 },
    locationSummary: { 
      clusterCoords: { lat: 28.7041, lng: 77.1025 },
      claimed: "Level 2",
      nearestCluster: "1 km",
      related: "12 Consulting Peers",
      shared: "Co-working space"
    },
    explanation: "Evidence is mixed and the claimed location appears to be associated with multiple businesses, requiring further review.",
    registryConsistency: "Moderate",
    locationActivity: "Mixed",
    geographicConsistency: "Mixed",
    locationType: "Shared",
    contradictionLevel: "Medium",
    supportingCount: 3,
    contradictionCount: 2,
    sourceCount: 4,
    signals: [
      { name: "Registry Match", type: "success", result: "Verified", contribution: "+30", source: "MCA" },
      { name: "Cadastral Footprint", type: "warning", result: "Commercial", contribution: "+28", source: "Municipal" }
    ],
    contradictions: [
      { title: "Shared Address", desc: "Address is a known shared co-working facility." },
      { title: "Employee Count", desc: "Employee count exceeds stated physical capacity." }
    ]
  }
];
