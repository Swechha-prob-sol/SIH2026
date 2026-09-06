// DEMO DATA - for hackathon presentation, not live-wired to backend yet
// Contains realistic Indian Standards, compliance specifications, past audit reports, and BIS certification schemes.

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
// 1. STANDARDS SEARCH DEMO DATA (6-8 Real Indian Standards)
// ---------------------------------------------------------------------------
export const DEMO_STANDARDS: StandardItem[] = [
  {
    id: "is-10500",
    code: "IS 10500:2012",
    title: "Drinking Water — Specification (Second Revision)",
    sector: "Water & Public Health",
    year: 2012,
    mandatory: true,
    keyClause: "Table 1 & Table 2 (Chemical & Organoleptic Requirements)",
    description:
      "Prescribes requirements, test methods, and dual-tier acceptable/permissible limits for potable water supplied through public networks, borewells, and packaged sources.",
    parameters: [
      {
        name: "Total Dissolved Solids (TDS)",
        acceptable: "500",
        permissible: "2000",
        unit: "mg/L",
        clause: "Table 1, Item 5",
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
        acceptable: "1",
        permissible: "5",
        unit: "NTU",
        clause: "Table 1, Item 4",
      },
      {
        name: "Total Hardness (as CaCO3)",
        acceptable: "200",
        permissible: "600",
        unit: "mg/L",
        clause: "Table 1, Item 6",
      },
    ],
  },
  {
    id: "is-1599",
    code: "IS 1599:2018",
    title: "Metallic Materials — Bend Test (Fourth Revision)",
    sector: "Manufacturing & Metallurgy",
    year: 2018,
    mandatory: false,
    keyClause: "Clause 6 & 7 (Mandrel Diameter & Angle of Bend)",
    description:
      "Standard test method for determining the capability of metallic materials to undergo plastic deformation in bending around a former without cracking.",
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
    id: "is-1875",
    code: "IS 1875:2020",
    title: "Carbon Steel Billets, Blooms, Slabs & Bars for Forgings",
    sector: "Manufacturing & Steel",
    year: 2020,
    mandatory: true,
    keyClause: "Table 1 (Chemical Composition of Steel Grades)",
    description:
      "Specifies metallurgical requirements, chemical compositions, and mechanical tensile tolerances for carbon steel forgings across engineering classes 1 to 6.",
    parameters: [
      {
        name: "Carbon Content (Class 2 Steel)",
        acceptable: "0.20 - 0.30",
        permissible: "± 0.02 product analysis tolerance",
        unit: "% weight",
        clause: "Table 1, Grade 2",
      },
      {
        name: "Sulphur & Phosphorus Max",
        acceptable: "0.040 max each",
        permissible: "0.045 max",
        unit: "% weight",
        clause: "Table 1, Item 3",
      },
    ],
  },
  {
    id: "is-456",
    code: "IS 456:2000",
    title: "Plain and Reinforced Concrete — Code of Practice",
    sector: "Civil & Construction",
    year: 2000,
    mandatory: true,
    keyClause: "Table 2 (Grades of Concrete & Compressive Strength)",
    description:
      "The foundational benchmark for design, structural safety, materials selection, and batching of plain and reinforced cement concrete across India.",
    parameters: [
      {
        name: "28-Day Compressive Strength (M25)",
        acceptable: "25.0",
        permissible: "Minimum 25 N/mm² batch mean",
        unit: "N/mm² (MPa)",
        clause: "Table 2, Item 3",
      },
      {
        name: "Max Water-Cement Ratio (Severe Exposure)",
        acceptable: "0.45",
        permissible: "0.50 (with plasticizers)",
        unit: "ratio",
        clause: "Table 5, Severe Condition",
      },
    ],
  },
  {
    id: "is-2062",
    code: "IS 2062:2011",
    title: "Hot Rolled Medium and High Tensile Structural Steel",
    sector: "Civil & Construction",
    year: 2011,
    mandatory: true,
    keyClause: "Table 1 & 2 (Mechanical Properties of Grade E250)",
    description:
      "Prescribes technical requirements for structural steel sections, plates, and bars used in bridges, skyscrapers, flyovers, and industrial plants.",
    parameters: [
      {
        name: "Yield Stress Min (Grade E250 A)",
        acceptable: "250",
        permissible: "240 (for thickness > 40mm)",
        unit: "MPa (N/mm²)",
        clause: "Table 2, Row 1",
      },
      {
        name: "Tensile Strength (UTS)",
        acceptable: "410",
        permissible: "410 - 540",
        unit: "MPa",
        clause: "Table 2, Row 1",
      },
    ],
  },
  {
    id: "is-14543",
    code: "IS 14543:2016",
    title: "Packaged Drinking Water (Other than Natural Mineral Water)",
    sector: "Food & Consumer Safety",
    year: 2016,
    mandatory: true,
    keyClause: "Clause 3 & Table 1 (Microbiological & Chemical Tolerances)",
    description:
      "Mandatory ISI certification standard ensuring commercial packaged bottled water is free from pathogens, heavy metals, pesticides, and excessive mineralization.",
    parameters: [
      {
        name: "Total Dissolved Solids (TDS)",
        acceptable: "75 - 500",
        permissible: "500 max (no relaxation)",
        unit: "mg/L",
        clause: "Table 1, Item 4",
      },
      {
        name: "E. Coli / Coliform Bacteria",
        acceptable: "0 (Absent)",
        permissible: "0 in 250ml sample",
        unit: "CFU/250ml",
        clause: "Table 2, Microbiological",
      },
    ],
  },
  {
    id: "is-1293",
    code: "IS 1293:2019",
    title: "Plugs and Socket-Outlets of Rated Voltage up to 250 Volts",
    sector: "Electrical & Electronics",
    year: 2019,
    mandatory: true,
    keyClause: "Section 13 & 14 (Insulation Resistance & Temperature Rise)",
    description:
      "Mandatory BIS quality control order standard for domestic 6A and 16A two-pole and three-pole electrical plugs and socket connectors.",
    parameters: [
      {
        name: "Insulation Resistance at 500V DC",
        acceptable: "≥ 5.0",
        permissible: "≥ 5.0 MΩ after humidity treatment",
        unit: "MΩ",
        clause: "Clause 14.1",
      },
      {
        name: "Terminal Temperature Rise Limit",
        acceptable: "≤ 45",
        permissible: "≤ 45 K under rated continuous load",
        unit: "Kelvin (K)",
        clause: "Clause 13.2",
      },
    ],
  },
  {
    id: "is-1417",
    code: "IS 1417:2016",
    title: "Gold and Gold Alloys, Jewellery/Artefacts — Fineness & Marking",
    sector: "Precious Metals & Hallmarking",
    year: 2016,
    mandatory: true,
    keyClause: "Table 1 & Clause 5 (Purity Grades & 6-digit HUID Laser Marking)",
    description:
      "Specifies the recognized fineness grades (24K, 22K, 18K, 14K) for mandatory hallmarking of gold jewellery, including assaying standards and traceability.",
    parameters: [
      {
        name: "22K Gold Fineness (916)",
        acceptable: "916.0",
        permissible: "Minimum 916.0 parts per thousand (no negative tolerance)",
        unit: "parts per 1000",
        clause: "Table 1, Row 2",
      },
      {
        name: "Laser Inscription Traceability",
        acceptable: "6-digit alphanumeric HUID code",
        permissible: "Mandatory BIS logo + Fineness + HUID",
        unit: "laser mark",
        clause: "Clause 5.3",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. COMPLIANCE CHECKER PRESETS (Real parameters with clauses)
// ---------------------------------------------------------------------------
export const DEMO_COMPLIANCE_PRESETS: CompliancePreset[] = [
  {
    label: "Potable Water TDS (480 mg/L)",
    productName: "Treated Municipal Potable Water",
    material: "Potable Water (Piped Supply)",
    standardCode: "IS 10500:2012",
    specName: "Total Dissolved Solids (TDS)",
    specValue: "480",
    expectedStatus: "compliant",
    reportSummary:
      "Meets IS 10500:2012 Table 1, Item 5 TDS requirement: observed 480 mg/L is comfortably within the 500 mg/L acceptable limit (and well below the 2000 mg/L permissible limit for alternate sources).",
    clauseRef: "Table 1, Item 5 — Organoleptic and Physical Parameters",
    details: {
      parameter: "Total Dissolved Solids (TDS)",
      observed: "480 mg/L",
      acceptable: "500 mg/L",
      permissible: "2000 mg/L (in absence of alternate source)",
      statusText: "COMPLIANT: Within optimal acceptable limit.",
    },
  },
  {
    label: "Class 2 Carbon Steel (C: 0.24%)",
    productName: "Heavy Machinery Shaft Forging",
    material: "Medium Carbon Steel Billet",
    standardCode: "IS 1875:2020",
    specName: "Carbon Content (C %)",
    specValue: "0.24",
    expectedStatus: "compliant",
    reportSummary:
      "Complies with IS 1875:2020 Table 1 for Class 2 Forgings. Observed Carbon concentration of 0.24% sits directly in the optimal range of 0.20% to 0.30%.",
    clauseRef: "Table 1, Grade 2 — Chemical Composition Requirements",
    details: {
      parameter: "Carbon Content (C %)",
      observed: "0.24%",
      acceptable: "0.20% - 0.30%",
      permissible: "± 0.02% product tolerance",
      statusText: "COMPLIANT: Fully conforming to Class 2 ladle analysis.",
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
      "FLAGGED: Observed 28-day compressive strength of 23.5 N/mm² falls below the required 25.0 N/mm² characteristic strength specified under IS 456:2000 Table 2 for Grade M25. Structural review and core sampling advised.",
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
    label: "Structural Steel E250 (Yield: 262 MPa)",
    productName: "I-Section Girder Plate",
    material: "Hot Rolled Medium Tensile Steel",
    standardCode: "IS 2062:2011",
    specName: "Yield Strength (Reh)",
    specValue: "262",
    expectedStatus: "compliant",
    reportSummary:
      "Meets IS 2062:2011 Table 2 Grade E250 A requirements. Observed yield strength of 262 MPa exceeds the mandatory threshold of 250 MPa with an elongation of 24%.",
    clauseRef: "Table 2 — Mechanical Properties of Structural Steel",
    details: {
      parameter: "Yield Stress (MPa)",
      observed: "262 MPa",
      acceptable: "≥ 250 MPa",
      permissible: "≥ 240 MPa (thickness > 40mm)",
      statusText: "COMPLIANT: Structural load safety factor satisfied.",
    },
  },
];

// ---------------------------------------------------------------------------
// 3. EXPORT REPORTS DEMO DATA (3-4 Realistic Past Audit Reports)
// ---------------------------------------------------------------------------
export const DEMO_PAST_REPORTS: PastReport[] = [
  {
    id: "REP-BIS-2026-0904",
    title: "TDS & Mineral Potability Compliance Audit — IS 10500",
    standardCode: "IS 10500:2012",
    standardName: "Drinking Water — Specification",
    sector: "Municipal Water Supply",
    date: "04 Sept 2026",
    status: "Compliant",
    evaluator: "Northern Regional Laboratory (NRL-BIS), Sahibabad",
    summary:
      "Comprehensive verification of potable distribution grid water. TDS tested at 440 mg/L (acceptable limit: 500 mg/L), pH at 7.2, and zero coliform contamination detected.",
    metrics: {
      tested: 14,
      passed: 14,
      flags: 0,
    },
  },
  {
    id: "REP-BIS-2026-0828",
    title: "Welding Electrode & Weldment Bend Audit — IS 1599",
    standardCode: "IS 1599:2018",
    standardName: "Metallic Materials — Bend Test",
    sector: "Heavy Engineering & Fabrication",
    date: "28 Aug 2026",
    status: "Compliant",
    evaluator: "Central Testing Laboratory (CLT-BIS), New Delhi",
    summary:
      "180-degree mandrel guided bend testing on Class-2 structural weld coupons. Zero fracture or tearing observed along the tension face.",
    metrics: {
      tested: 8,
      passed: 8,
      flags: 0,
    },
  },
  {
    id: "REP-BIS-2026-0815",
    title: "Reinforced Concrete Batch Audit (M25) — IS 456",
    standardCode: "IS 456:2000",
    standardName: "Plain and Reinforced Concrete",
    sector: "Commercial Construction",
    date: "15 Aug 2026",
    status: "Review Required",
    evaluator: "Western Regional Office Lab, Mumbai",
    summary:
      "28-day cube crushing test averaged 23.5 MPa across 3 samples against M25 design threshold (25.0 MPa). Engineering recommendation issued for non-destructive rebound hammer re-test.",
    metrics: {
      tested: 6,
      passed: 4,
      flags: 2,
    },
  },
  {
    id: "REP-BIS-2026-0802",
    title: "22K Gold Jewellery Assay & HUID Inscription — IS 1417",
    standardCode: "IS 1417:2016",
    standardName: "Gold and Gold Alloys, Jewellery Fineness",
    sector: "Precious Metals & Hallmarking",
    date: "02 Aug 2026",
    status: "Compliant",
    evaluator: "BIS Recognized Assaying & Hallmarking Centre, Karol Bagh",
    summary:
      "Fire assay fineness verification confirmed 916.4 parts per thousand. Microscopic laser verification validated clear 6-character HUID alphanumeric inscription conforming to BIS Hallmarking regulations.",
    metrics: {
      tested: 25,
      passed: 25,
      flags: 0,
    },
  },
];

// ---------------------------------------------------------------------------
// 4. BIS CERTIFICATION SCHEMES (3 Real Schemes)
// ---------------------------------------------------------------------------
export const DEMO_CERTIFICATION_SCHEMES: CertificationScheme[] = [
  {
    id: "scheme-isi",
    name: "ISI Mark Scheme (Scheme I)",
    code: "Scheme I — Product Certification",
    category: "Mandatory & Voluntary Product Certification",
    badge: "Most Widely Recognized Mark in India",
    description:
      "The flagship ISI mark certifies that products conform to designated Indian Standards formulated by BIS. Involves mandatory factory premise inspections, in-house laboratory audits, witness testing, and continuous random market sample surveillance. Required for over 380 critical industrial and consumer products.",
    keyProducts: [
      "Packaged Drinking Water (IS 14543)",
      "Ordinary Portland Cement (IS 269)",
      "Structural Steel Sections (IS 2062)",
      "LPG Cylinders & Valves (IS 3196)",
      "Electric Irons & Immersion Heaters",
    ],
    suggestedPrompt:
      "Explain the step-by-step process, factory audit requirements, and fee structure for obtaining an ISI Mark (Scheme I) license under BIS.",
  },
  {
    id: "scheme-crs",
    name: "Compulsory Registration Scheme (CRS)",
    code: "Scheme II — Self-Declaration of Conformity",
    category: "Electronics & Information Technology Goods",
    badge: "Ministry of Electronics & IT (MeitY) Mandated",
    description:
      "Governed under Scheme II of BIS Conformity Assessment Regulations 2018. Designed specifically for the fast-evolving electronics, telecommunications, and IT sectors. Manufacturers test products in BIS-recognized labs and submit a formal Self-Declaration of Conformity without requiring mandatory prior factory visits.",
    keyProducts: [
      "Mobile Phones & Tablets",
      "Laptops & Notebook Computers",
      "LED Luminaires & Control Gears",
      "Power Adapters & Chargers",
      "Lithium-ion Secondary Cells & Batteries",
    ],
    suggestedPrompt:
      "Which IT and electronic products require mandatory self-declaration under the BIS Compulsory Registration Scheme (CRS), and what are the testing turnaround times?",
  },
  {
    id: "scheme-hallmarking",
    name: "Hallmarking Scheme for Precious Metals",
    code: "Precious Metals Scheme — Gold & Silver",
    category: "Consumer Protection & Purity Certification",
    badge: "Mandatory in 343+ Indian Districts",
    description:
      "Guarantees the declared purity and fineness of gold and silver jewellery sold across India. Every certified article receives a three-part laser mark: the official BIS Triangular Logo, the fineness grade (e.g. 22K916, 18K750, 14K585), and an encrypted 6-digit alphanumeric HUID (Hallmark Unique Identification) verifiable via the BIS CARE mobile app.",
    keyProducts: [
      "22 Karat Gold Jewellery (916 Purity)",
      "18 Karat Gold Jewellery (750 Purity)",
      "14 Karat Gold Jewellery (585 Purity)",
      "Silver Medallions & Utensils",
      "Bullion Bars & Coins",
    ],
    suggestedPrompt:
      "What are the mandatory hallmarking purity grades, laser marking rules, and 6-digit HUID verification protocols for gold jewellery in India?",
  },
];
