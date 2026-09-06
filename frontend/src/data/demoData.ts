// DEMO DATA - Official Bureau of Indian Standards (BIS) Dataset
// Grounded in official BIS catalogues, Conformity Assessment Regulations 2018, and Manakonline Gazette Notifications.

export interface StandardItem {
  id: string;
  code: string;
  title: string;
  sector: string;
  description: string;
  year: number;
  mandatory: boolean;
  keyClause: string;
  parameters: {
    name: string;
    acceptable: string;
    permissible: string;
    unit: string;
    clause: string;
  }[];
}

export interface CompliancePreset {
  label: string;
  productName: string;
  material: string;
  standardCode: string;
  specName: string;
  specValue: string;
  expectedStatus: "compliant" | "review_required";
  reportSummary: string;
  clauseRef: string;
  details: {
    parameter: string;
    observed: string;
    acceptable: string;
    permissible: string;
    statusText: string;
  };
}

export interface PastReport {
  id: string;
  title: string;
  standardCode: string;
  standardName: string;
  sector: string;
  date: string;
  status: "Compliant" | "Review Required";
  evaluator: string;
  summary: string;
  metrics: {
    tested: number;
    passed: number;
    flags: number;
  };
}

export interface CertificationScheme {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  badge: string;
  keyProducts: string[];
  suggestedPrompt: string;
}

// ---------------------------------------------------------------------------
// 1. STANDARDS SEARCH DEMO DATA (Authentic Indian Standards from BIS)
// ---------------------------------------------------------------------------
export const DEMO_STANDARDS: StandardItem[] = [
  {
    id: "is-10500",
    code: "IS 10500:2012",
    title: "Drinking Water — Specification (Second Revision)",
    sector: "Food & Agriculture (FAD 26)",
    year: 2012,
    mandatory: true,
    keyClause: "Table 1 (Organoleptic/Physical) & Table 2 (Chemical Requirements)",
    description:
      "Official BIS standard prescribing physical, chemical, and microbiological requirements, test procedures, and dual-tier acceptable/permissible quality thresholds for drinking water across India.",
    parameters: [
      {
        name: "Total Dissolved Solids (TDS)",
        acceptable: "500",
        permissible: "2000 (in absence of alternate source)",
        unit: "mg/L",
        clause: "Table 2, Item 11",
      },
      {
        name: "pH Value",
        acceptable: "6.5 - 8.5",
        permissible: "No relaxation",
        unit: "pH scale",
        clause: "Table 1, Item 3",
      },
      {
        name: "Turbidity",
        acceptable: "1.0",
        permissible: "5.0",
        unit: "NTU",
        clause: "Table 1, Item 4",
      },
      {
        name: "Total Hardness (as CaCO3)",
        acceptable: "200",
        permissible: "600",
        unit: "mg/L",
        clause: "Table 2, Item 1",
      },
      {
        name: "Fluoride (as F)",
        acceptable: "1.0",
        permissible: "1.5",
        unit: "mg/L",
        clause: "Table 2, Item 8",
      },
    ],
  },
  {
    id: "is-14543",
    code: "IS 14543:2024",
    title: "Packaged Drinking Water (Other than Natural Mineral Water) — Specification",
    sector: "Food & Agriculture (FAD 26)",
    year: 2024,
    mandatory: true,
    keyClause: "Clause 3.2, Table 1 (Physico-Chemical) & Table 2 (Microbiological)",
    description:
      "Mandatory ISI certification standard under BIS Scheme I for commercially bottled drinking water, mandating zero pathogenic contamination, strict mineral limits, and tamper-evident packaging.",
    parameters: [
      {
        name: "Total Dissolved Solids (TDS)",
        acceptable: "75 - 500",
        permissible: "500 max (no relaxation)",
        unit: "mg/L",
        clause: "Table 1, Item 4",
      },
      {
        name: "Escherichia coli / Coliform Bacteria",
        acceptable: "0 (Absent)",
        permissible: "0 in 250ml sample",
        unit: "CFU/250ml",
        clause: "Table 2, Microbiological",
      },
      {
        name: "Sulfate (as SO4)",
        acceptable: "200",
        permissible: "200 (no relaxation)",
        unit: "mg/L",
        clause: "Table 1, Item 9",
      },
    ],
  },
  {
    id: "is-269",
    code: "IS 269:2015",
    title: "Ordinary Portland Cement (33, 43 and 53 Grades) — Specification",
    sector: "Civil Engineering (CED 2)",
    year: 2015,
    mandatory: true,
    keyClause: "Table 2 (Physical Requirements) & Table 1 (Chemical Composition)",
    description:
      "Unified BIS standard governing physical and chemical quality parameters for Ordinary Portland Cement (OPC) across 33, 43, and 53 grades used in structural concrete.",
    parameters: [
      {
        name: "28-Day Compressive Strength (53 Grade)",
        acceptable: "≥ 53.0",
        permissible: "Minimum 53.0 N/mm² batch mean",
        unit: "N/mm² (MPa)",
        clause: "Table 2, Row 3",
      },
      {
        name: "Initial Setting Time",
        acceptable: "≥ 30",
        permissible: "Minimum 30 minutes",
        unit: "minutes",
        clause: "Table 2, Row 1",
      },
      {
        name: "Final Setting Time",
        acceptable: "≤ 600",
        permissible: "Maximum 600 minutes",
        unit: "minutes",
        clause: "Table 2, Row 2",
      },
    ],
  },
  {
    id: "is-456",
    code: "IS 456:2000",
    title: "Plain and Reinforced Concrete — Code of Practice",
    sector: "Civil Engineering (CED 2)",
    year: 2000,
    mandatory: true,
    keyClause: "Table 2 (Grades of Concrete) & Table 5 (Min Cement & Max W/C Ratio)",
    description:
      "The primary code of practice published by BIS for design, structural safety, concrete batching, exposure limits, and reinforcement detailing in civil infrastructure.",
    parameters: [
      {
        name: "28-Day Compressive Strength (M25)",
        acceptable: "25.0",
        permissible: "fck + 0.825 × standard deviation",
        unit: "N/mm² (MPa)",
        clause: "Table 2, Item 3",
      },
      {
        name: "Max Free Water-Cement Ratio (Severe Exposure)",
        acceptable: "0.45",
        permissible: "0.50 (with plasticizers)",
        unit: "ratio",
        clause: "Table 5, Severe Condition",
      },
      {
        name: "Minimum Cement Content (Severe)",
        acceptable: "320",
        permissible: "320",
        unit: "kg/m³",
        clause: "Table 5, Row 3",
      },
    ],
  },
  {
    id: "is-1786",
    code: "IS 1786:2008",
    title: "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
    sector: "Civil Engineering & Metallurgy (MTD 4)",
    year: 2008,
    mandatory: true,
    keyClause: "Table 3 (Mechanical Properties of Fe 500D Grade)",
    description:
      "Specifies requirements for thermo-mechanically treated (TMT) high-strength deformed steel bars (Fe 415, Fe 500, Fe 500D, Fe 550) used in seismic and structural reinforcement.",
    parameters: [
      {
        name: "0.2% Proof Stress / Yield Stress (Fe 500D)",
        acceptable: "≥ 500.0",
        permissible: "Minimum 500.0 MPa",
        unit: "N/mm² (MPa)",
        clause: "Table 3, Grade Fe 500D",
      },
      {
        name: "UTS / YS Ratio (Tensile Strength to Yield)",
        acceptable: "≥ 1.10",
        permissible: "Minimum 1.10 ratio",
        unit: "ratio",
        clause: "Table 3, Grade Fe 500D",
      },
      {
        name: "Total Elongation at Max Force (Agt)",
        acceptable: "≥ 5.0",
        permissible: "Minimum 5.0 %",
        unit: "%",
        clause: "Table 3, Item 4",
      },
    ],
  },
  {
    id: "is-2062",
    code: "IS 2062:2011",
    title: "Hot Rolled Medium and High Tensile Structural Steel — Specification",
    sector: "Metallurgical Engineering (MTD 4)",
    year: 2011,
    mandatory: true,
    keyClause: "Table 1 (Chemical Composition) & Table 2 (Mechanical Properties)",
    description:
      "BIS quality standard for structural steel sections, plates, and flats used in bridges, heavy industrial infrastructure, skyscrapers, and railway structures.",
    parameters: [
      {
        name: "Yield Strength (Grade E250 Quality A)",
        acceptable: "250",
        permissible: "240 (for thickness > 40mm)",
        unit: "MPa (N/mm²)",
        clause: "Table 2, Row 1",
      },
      {
        name: "Ultimate Tensile Strength (UTS)",
        acceptable: "410",
        permissible: "410 - 540",
        unit: "MPa",
        clause: "Table 2, Row 1",
      },
      {
        name: "Carbon Equivalent (CE) Max",
        acceptable: "0.42",
        permissible: "0.44 max",
        unit: "% weight",
        clause: "Table 1, Footnote",
      },
    ],
  },
  {
    id: "is-1599",
    code: "IS 1599:2018",
    title: "Metallic Materials — Bend Test (Fourth Revision)",
    sector: "Metallurgical Engineering (MTD 3)",
    year: 2018,
    mandatory: false,
    keyClause: "Clause 6 (Test Piece) & Clause 7 (Former Diameter & Bend Angle)",
    description:
      "Standard test method for evaluating ductility and surface soundness of metallic products by plastic deformation in bending around a former without cracking.",
    parameters: [
      {
        name: "Angle of Bend (α)",
        acceptable: "180°",
        permissible: "180° (no cracks on outer surface)",
        unit: "degrees",
        clause: "Clause 7.2",
      },
      {
        name: "Surface Defect Limit",
        acceptable: "Zero visible cracks under 5x magnification",
        permissible: "< 1.5mm edge tears only",
        unit: "visual inspection",
        clause: "Clause 8.1",
      },
    ],
  },
  {
    id: "is-1417",
    code: "IS 1417:2016",
    title: "Gold and Gold Alloys, Jewellery/Artefacts — Fineness & Marking",
    sector: "Precious Metals (MTD 10)",
    year: 2016,
    mandatory: true,
    keyClause: "Table 1 (Recognized Fineness Grades) & Clause 5 (HUID Laser Marking)",
    description:
      "Mandatory BIS hallmarking standard establishing recognized purity grades (24K, 23K, 22K, 20K, 18K, 14K) and 6-digit Hallmark Unique Identification (HUID) protocols.",
    parameters: [
      {
        name: "22 Karat Gold Fineness (22K916)",
        acceptable: "916.0",
        permissible: "Minimum 916.0 parts per thousand (no negative tolerance)",
        unit: "parts per 1000",
        clause: "Table 1, Row 3",
      },
      {
        name: "18 Karat Gold Fineness (18K750)",
        acceptable: "750.0",
        permissible: "Minimum 750.0 parts per thousand",
        unit: "parts per 1000",
        clause: "Table 1, Row 5",
      },
      {
        name: "Hallmark Traceability Markings",
        acceptable: "BIS Logo + Fineness + 6-digit HUID",
        permissible: "Mandatory laser inscription via recognized AHC",
        unit: "laser mark",
        clause: "Clause 5.3",
      },
    ],
  },
  {
    id: "is-302",
    code: "IS 302-1:2024",
    title: "Safety of Household and Similar Electrical Appliances — General Requirements",
    sector: "Electrotechnical (ETD 32)",
    year: 2024,
    mandatory: true,
    keyClause: "Clause 13 (Electrical Resistance & Leakage Current) & Clause 19 (Abnormal Operation)",
    description:
      "General safety code under BIS Electrical Appliances Quality Control Order governing insulation safety, temperature rise, and shock protection for consumer devices.",
    parameters: [
      {
        name: "Insulation Resistance at 500V DC",
        acceptable: "≥ 2.0",
        permissible: "≥ 7.0 MΩ for reinforced insulation",
        unit: "MΩ",
        clause: "Clause 13.2",
      },
      {
        name: "Leakage Current (Class I Portable Appliance)",
        acceptable: "≤ 0.75",
        permissible: "≤ 0.75 mA at operating temperature",
        unit: "mA",
        clause: "Clause 13.1",
      },
    ],
  },
  {
    id: "is-1293",
    code: "IS 1293:2019",
    title: "Plugs and Socket-Outlets of Rated Voltage up to 250V — Specification",
    sector: "Electrotechnical (ETD 14)",
    year: 2019,
    mandatory: true,
    keyClause: "Clause 13 (Temperature Rise) & Clause 16 (Mechanical Strength)",
    description:
      "Mandatory Quality Control Order standard for domestic 6A and 16A two-pole and three-pole electrical plugs, sockets, and adapters.",
    parameters: [
      {
        name: "Terminal Temperature Rise Limit",
        acceptable: "≤ 45",
        permissible: "≤ 45 K under rated continuous current",
        unit: "Kelvin (K)",
        clause: "Clause 13.2",
      },
      {
        name: "Insulation Resistance at 500V DC",
        acceptable: "≥ 5.0",
        permissible: "≥ 5.0 MΩ after humidity treatment",
        unit: "MΩ",
        clause: "Clause 14.1",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. COMPLIANCE CHECKER PRESETS (Clause-level evaluation based on BIS data)
// ---------------------------------------------------------------------------
export const DEMO_COMPLIANCE_PRESETS: CompliancePreset[] = [
  {
    label: "Potable Water TDS (480 mg/L)",
    productName: "Treated Municipal Potable Water",
    material: "Potable Water (Piped Distribution Grid)",
    standardCode: "IS 10500:2012",
    specName: "Total Dissolved Solids (TDS)",
    specValue: "480",
    expectedStatus: "compliant",
    reportSummary:
      "Meets IS 10500:2012 Table 2, Item 11 TDS requirement: observed 480 mg/L is within the 500 mg/L acceptable limit (and comfortably below the 2000 mg/L permissible limit in absence of alternate source).",
    clauseRef: "Table 2, Item 11 — General Chemical Parameters",
    details: {
      parameter: "Total Dissolved Solids (TDS)",
      observed: "480 mg/L",
      acceptable: "500 mg/L",
      permissible: "2000 mg/L (in absence of alternate source)",
      statusText: "COMPLIANT: Within optimal acceptable limit.",
    },
  },
  {
    label: "Concrete Cube Strength (23.5 MPa)",
    productName: "High-Rise Column Concrete Batch (M25)",
    material: "Ready-Mix Concrete (M25 Design Mix)",
    standardCode: "IS 456:2000",
    specName: "28-Day Compressive Strength",
    specValue: "23.5",
    expectedStatus: "review_required",
    reportSummary:
      "FLAGGED: Observed 28-day compressive strength of 23.5 N/mm² falls below the required 25.0 N/mm² characteristic strength specified under IS 456:2000 Table 2 for Grade M25. Structural review and non-destructive rebound hammer test advised.",
    clauseRef: "Table 2 & Clause 15.4 — Acceptance Criteria for Concrete Strength",
    details: {
      parameter: "28-Day Compressive Strength",
      observed: "23.5 N/mm²",
      acceptable: "≥ 25.0 N/mm²",
      permissible: "fck + 0.825 × standard deviation",
      statusText: "REVIEW REQUIRED: 1.5 N/mm² deficit against target strength.",
    },
  },
  {
    label: "TMT Rebar Fe 500D Yield (518 MPa)",
    productName: "High Ductility TMT Reinforcement Bar",
    material: "Thermo-Mechanically Treated Steel (Fe 500D)",
    standardCode: "IS 1786:2008",
    specName: "0.2% Proof Stress / Yield Stress",
    specValue: "518",
    expectedStatus: "compliant",
    reportSummary:
      "Complies with IS 1786:2008 Table 3 for Grade Fe 500D. Observed yield strength of 518 N/mm² exceeds the mandatory minimum threshold of 500 N/mm² with an elongation of 16.5%.",
    clauseRef: "Table 3 — Mechanical Properties of High Strength Deformed Bars",
    details: {
      parameter: "Yield Stress (0.2% Proof Stress)",
      observed: "518 N/mm² (MPa)",
      acceptable: "≥ 500 N/mm²",
      permissible: "≥ 500 N/mm²",
      statusText: "COMPLIANT: High ductility seismic requirement satisfied.",
    },
  },
  {
    label: "22K Gold Jewellery Assay (916.5)",
    productName: "22 Karat Gold Bangle Batch",
    material: "Gold Alloy (22K / Fineness 916)",
    standardCode: "IS 1417:2016",
    specName: "Gold Fineness Purity",
    specValue: "916.5",
    expectedStatus: "compliant",
    reportSummary:
      "Fire assay fineness verification confirmed 916.5 parts per thousand. Microscopic laser verification validated clear 6-character HUID (Hallmark Unique Identification) code conforming to BIS Hallmarking Regulations.",
    clauseRef: "Table 1, Row 3 & Clause 5 — Fineness & HUID Marking",
    details: {
      parameter: "Gold Fineness (Purity)",
      observed: "916.5 ppt",
      acceptable: "≥ 916.0 ppt",
      permissible: "916.0 ppt (no negative tolerance)",
      statusText: "COMPLIANT: Passed fire assay purity & laser HUID verification.",
    },
  },
  {
    label: "OPC 53 Grade Cement (54.2 MPa)",
    productName: "Ordinary Portland Cement (OPC 53)",
    material: "Ground Clinker Cement Batch #109",
    standardCode: "IS 269:2015",
    specName: "28-Day Compressive Strength",
    specValue: "54.2",
    expectedStatus: "compliant",
    reportSummary:
      "Meets IS 269:2015 Table 2 requirements for 53 Grade Cement. Observed 28-day compressive strength of 54.2 N/mm² satisfies the minimum mandatory 53.0 N/mm² specification.",
    clauseRef: "Table 2, Row 3 — Physical Requirements of Portland Cement",
    details: {
      parameter: "28-Day Compressive Strength",
      observed: "54.2 N/mm²",
      acceptable: "≥ 53.0 N/mm²",
      permissible: "≥ 53.0 N/mm²",
      statusText: "COMPLIANT: Exceeds minimum strength benchmark.",
    },
  },
];

// ---------------------------------------------------------------------------
// 3. EXPORT REPORTS DEMO DATA (Realistic Past BIS Audit Reports)
// ---------------------------------------------------------------------------
export const DEMO_PAST_REPORTS: PastReport[] = [
  {
    id: "REP-BIS-2026-0904",
    title: "Potable Water TDS & Chemical Parameter Audit — IS 10500",
    standardCode: "IS 10500:2012",
    standardName: "Drinking Water — Specification",
    sector: "Municipal Water Supply",
    date: "04 Sept 2026",
    status: "Compliant",
    evaluator: "Central Laboratory (CL), Bureau of Indian Standards, Sahibabad",
    summary:
      "Comprehensive verification of municipal distribution grid water. TDS tested at 440 mg/L (acceptable limit: 500 mg/L), pH at 7.2, and zero coliform pathogens detected.",
    metrics: {
      tested: 14,
      passed: 14,
      flags: 0,
    },
  },
  {
    id: "REP-BIS-2026-0828",
    title: "Structural Steel TMT Bar Reinforcement Mechanical Audit — IS 1786",
    standardCode: "IS 1786:2008",
    standardName: "High Strength Deformed Steel Bars",
    sector: "Civil & Metallurgical Infrastructure",
    date: "28 Aug 2026",
    status: "Compliant",
    evaluator: "Western Regional Office Laboratory (WROL-BIS), Mumbai",
    summary:
      "Tensile, proof stress, and 180-degree mandrel bend tests on Grade Fe 500D TMT rebar coupons. Yield stress recorded at 518 MPa (min requirement: 500 MPa) with zero cracking on tension face.",
    metrics: {
      tested: 10,
      passed: 10,
      flags: 0,
    },
  },
  {
    id: "REP-BIS-2026-0815",
    title: "Reinforced Concrete Batch Audit (M25 Grade) — IS 456",
    standardCode: "IS 456:2000",
    standardName: "Plain and Reinforced Concrete",
    sector: "Commercial Construction",
    date: "15 Aug 2026",
    status: "Review Required",
    evaluator: "Northern Regional Office Laboratory (NROL-BIS), Mohali",
    summary:
      "28-day cube crushing test averaged 23.5 MPa across 3 test cubes against M25 design threshold (25.0 MPa). Technical recommendation issued for ultrasonic pulse velocity (UPV) re-audit.",
    metrics: {
      tested: 6,
      passed: 4,
      flags: 2,
    },
  },
  {
    id: "REP-BIS-2026-0802",
    title: "22K Gold Jewellery Fire Assay & HUID Laser Audit — IS 1417",
    standardCode: "IS 1417:2016",
    standardName: "Gold and Gold Alloys, Jewellery Fineness",
    sector: "Precious Metals & Hallmarking",
    date: "02 Aug 2026",
    status: "Compliant",
    evaluator: "BIS Recognized Assaying & Hallmarking Centre, Karol Bagh, New Delhi",
    summary:
      "Fire assay fineness verification confirmed 916.4 parts per thousand. Microscopic laser verification validated clear 6-character HUID alphanumeric code registered on the BIS CARE server.",
    metrics: {
      tested: 25,
      passed: 25,
      flags: 0,
    },
  },
  {
    id: "REP-BIS-2026-0720",
    title: "Packaged Drinking Water Microbiological & Chemical Surveillance — IS 14543",
    standardCode: "IS 14543:2024",
    standardName: "Packaged Drinking Water",
    sector: "Food & Consumer Safety",
    date: "20 July 2026",
    status: "Compliant",
    evaluator: "Southern Regional Office Laboratory (SROL-BIS), Chennai",
    summary:
      "Random surveillance sampling of commercial 20L bottled water. Absence of E. Coli and Coliform confirmed in 250ml sample; TDS registered at 112 mg/L.",
    metrics: {
      tested: 18,
      passed: 18,
      flags: 0,
    },
  },
];

// ---------------------------------------------------------------------------
// 4. BIS CERTIFICATION SCHEMES (Official Schemes from BIS website - bis.gov.in)
// ---------------------------------------------------------------------------
export const DEMO_CERTIFICATION_SCHEMES: CertificationScheme[] = [
  {
    id: "scheme-isi",
    name: "ISI Mark Scheme (Scheme - I)",
    code: "Scheme I — Product Certification",
    category: "Mandatory & Voluntary Product Certification",
    badge: "Flagship BIS Certification Mark of India",
    description:
      "Governed under Scheme I of BIS Conformity Assessment Regulations, 2018. Features mandatory factory premise audits, testing facility verification, competency check of quality control personnel, witness testing, and continuous market surveillance sampling. Applicable for over 380 products under mandatory Quality Control Orders (QCOs).",
    keyProducts: [
      "Packaged Drinking Water (IS 14543)",
      "Ordinary Portland Cement (IS 269)",
      "High Strength Deformed Steel Bars (IS 1786)",
      "LPG Cylinders & Valves (IS 3196)",
      "Protective Helmets for Two-Wheelers (IS 4151)",
    ],
    suggestedPrompt:
      "Explain the step-by-step process, factory audit requirements, and fee structure for obtaining an ISI Mark (Scheme I) license under BIS.",
  },
  {
    id: "scheme-crs",
    name: "Compulsory Registration Scheme (CRS)",
    code: "Scheme II — Self-Declaration of Conformity",
    category: "Electronics & IT Goods Conformity",
    badge: "MeitY & Ministry of Power Mandated",
    description:
      "Governed under Scheme II of BIS Conformity Assessment Regulations, 2018. Tailored for fast-evolving electronic and IT goods. Manufacturers test products at BIS-recognized laboratories and submit a formal Self-Declaration of Conformity without requiring mandatory pre-grant factory visits.",
    keyProducts: [
      "Mobile Phones & Smart Handsets",
      "Laptops, Notebooks & Tablets",
      "LED Luminaires & Control Gear",
      "Power Adapters & Battery Chargers",
      "Lithium-ion Secondary Cells & Packs",
    ],
    suggestedPrompt:
      "Which IT and electronic products require mandatory self-declaration under the BIS Compulsory Registration Scheme (CRS), and what are the testing turnaround times?",
  },
  {
    id: "scheme-fmcs",
    name: "Foreign Manufacturers Certification Scheme (FMCS)",
    code: "Scheme I (Overseas) — Foreign License",
    category: "International Trade & Import Quality Control",
    badge: "Mandatory for Overseas Exporters to India",
    description:
      "Enables foreign manufacturers located outside India to obtain a license to use the ISI Mark on products exported to the Indian market. Involves appointing an Authorized Indian Representative (AIR), physical inspection of overseas manufacturing plants by BIS officers, and sample testing at BIS labs.",
    keyProducts: [
      "Solar Photovoltaic (PV) Modules",
      "Structural Steel Sections & Plates",
      "Chemical Resins & Synthetic Fibres",
      "Transformers & Heavy Electrical Machinery",
      "Automotive Tyres & Tubes",
    ],
    suggestedPrompt:
      "What are the requirements for foreign manufacturers to get a BIS FMCS license, appoint an Authorized Indian Representative (AIR), and export ISI marked goods to India?",
  },
  {
    id: "scheme-hallmarking",
    name: "Hallmarking Scheme for Precious Metals",
    code: "Hallmarking — Gold & Silver Purity",
    category: "Consumer Protection & Purity Certification",
    badge: "Mandatory in 343+ Indian Districts",
    description:
      "Third-party guarantee of gold and silver fineness governed under BIS Hallmarking Regulations. Every certified article receives a 3-part laser mark: the official BIS Triangular Logo, the fineness grade (e.g. 22K916, 18K750, 14K585), and an encrypted 6-digit Hallmark Unique Identification (HUID) code verifiable via the BIS CARE mobile app.",
    keyProducts: [
      "22 Karat Gold Jewellery (916 Purity)",
      "18 Karat Gold Jewellery (750 Purity)",
      "14 Karat Gold Jewellery (585 Purity)",
      "24 Karat Gold Bullion Coins & Bars (999 Purity)",
      "Silver Artefacts & Utensils",
    ],
    suggestedPrompt:
      "What are the mandatory hallmarking purity grades, laser marking rules, and 6-digit HUID verification protocols for gold jewellery in India?",
  },
  {
    id: "scheme-mscs",
    name: "Management Systems Certification Scheme (MSCS)",
    code: "Systems Certification — ISO Transposed",
    category: "Quality, Environmental & Safety Systems",
    badge: "Accredited under NABCB Framework",
    description:
      "Grants certification to organizations conforming to international management system standards adopted as Indian Standards. Encompasses Quality Management (IS/ISO 9001), Environmental Management (IS/ISO 14001), Food Safety (IS/ISO 22000), Occupational Health & Safety (IS/ISO 45001), and Information Security (IS/ISO 27001).",
    keyProducts: [
      "Quality Management Systems (IS/ISO 9001)",
      "Environmental Management Systems (IS/ISO 14001)",
      "Food Safety Management Systems (IS/ISO 22000)",
      "Occupational Health & Safety Systems (IS/ISO 45001)",
      "Information Security Systems (IS/ISO 27001)",
    ],
    suggestedPrompt:
      "How can an industrial unit obtain BIS Management Systems Certification (IS/ISO 9001 or IS/ISO 22000), and what is the audit procedure?",
  },
  {
    id: "scheme-ecomark",
    name: "Eco Mark Scheme for Environmentally Friendly Products",
    code: "Eco Mark — Sustainable Products",
    category: "Environmental Protection & Green Standard",
    badge: "Ministry of Environment, Forest & Climate Change",
    description:
      "A specialized labeling scheme administered by BIS to identify consumer products that meet specific environmental criteria alongside primary quality, safety, and performance standards stipulated under relevant Indian Standards.",
    keyProducts: [
      "Eco-Friendly Soaps & Detergents",
      "Architectural & Household Paints",
      "Primary & Secondary Batteries",
      "Recycled Paper & Paperboard",
      "Leather Goods & Footwear",
    ],
    suggestedPrompt:
      "What are the eligibility criteria and testing guidelines to get an Eco Mark certification from BIS for eco-friendly consumer goods?",
  },
];
