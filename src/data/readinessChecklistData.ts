import { ReadinessChecklistItem } from '../types/pmo';

export const INITIAL_READINESS_CHECKLIST: ReadinessChecklistItem[] = [
  // Phase 1: Project Justification & Feasibility (1 - 6)
  {
    id: 1,
    phase: "1. Justification & Feasibility",
    phaseId: 1,
    title: "Strategic Business Case Document",
    description: "Formally documented business need, organizational strategic fit, and target value realization.",
    category: "Strategic",
    isCompleted: true,
    completedAt: "2026-09-15 09:30",
    responsibleRole: "Project Sponsor",
    notes: "Approved by Strategic Investment Committee"
  },
  {
    id: 2,
    phase: "1. Justification & Feasibility",
    phaseId: 1,
    title: "Strategic Alignment & OKR Mapping",
    description: "Verification that project outcomes directly support key company OKRs and annual roadmap.",
    category: "Strategic",
    isCompleted: true,
    completedAt: "2026-09-18 14:00",
    responsibleRole: "PMO Lead",
    notes: "Mapped to Corporate Pillar 2: Operational Scalability"
  },
  {
    id: 3,
    phase: "1. Justification & Feasibility",
    phaseId: 1,
    title: "Preliminary Feasibility Study (FS)",
    description: "Comprehensive technical, economic, legal, operational, and schedule feasibility assessment.",
    category: "Technical & Economic",
    isCompleted: true,
    completedAt: "2026-09-25 11:15",
    responsibleRole: "Lead Consultant",
    notes: "Score: 92/100, recommended for full deployment"
  },
  {
    id: 4,
    phase: "1. Justification & Feasibility",
    phaseId: 1,
    title: "Cost-Benefit Analysis (CBA)",
    description: "Financial quantitative comparison of total cost of ownership against projected benefits.",
    category: "Financial",
    isCompleted: true,
    completedAt: "2026-09-28 16:45",
    responsibleRole: "Finance Lead",
    notes: "NPV positive, IRR 24.5%"
  },
  {
    id: 5,
    phase: "1. Justification & Feasibility",
    phaseId: 1,
    title: "Initial Budget Allocation Approval",
    description: "Secured CAPEX/OPEX capital commitment from Executive Finance board.",
    category: "Financial",
    isCompleted: true,
    completedAt: "2026-10-02 10:00",
    responsibleRole: "CFO / Finance Director",
    notes: "CAPEX allocation authorized under FY budget"
  },
  {
    id: 6,
    phase: "1. Justification & Feasibility",
    phaseId: 1,
    title: "ROI & Payback Period Projection",
    description: "Calculated payback duration and projected 3-year return on capital expenditure.",
    category: "Financial",
    isCompleted: false,
    responsibleRole: "Finance Analyst"
  },

  // Phase 2: Governance, Stakeholders & Charter (7 - 12)
  {
    id: 7,
    phase: "2. Governance & Charter",
    phaseId: 2,
    title: "Project Charter Document Finalized",
    description: "Comprehensive pre-project charter outlining objectives, scope boundaries, and high-level milestones.",
    category: "Governance",
    isCompleted: true,
    completedAt: "2026-10-05 15:30",
    responsibleRole: "Project Manager",
    notes: "Ready for formal sign-off"
  },
  {
    id: 8,
    phase: "2. Governance & Charter",
    phaseId: 2,
    title: "Project Sponsor Formal Sign-off",
    description: "Executive Sponsor written mandate establishing project authorization.",
    category: "Governance",
    isCompleted: true,
    completedAt: "2026-10-06 09:10",
    responsibleRole: "Project Sponsor",
    notes: "Signed digitally"
  },
  {
    id: 9,
    phase: "2. Governance & Charter",
    phaseId: 2,
    title: "Project Manager Appointment Letter",
    description: "Official delegation of authority to the PM regarding resources, procurement, and team leadership.",
    category: "Governance",
    isCompleted: true,
    completedAt: "2026-10-07 13:00",
    responsibleRole: "Head of PMO"
  },
  {
    id: 10,
    phase: "2. Governance & Charter",
    phaseId: 2,
    title: "Steering Committee Charter & Roster",
    description: "Defined Steering Committee composition, voting thresholds, and monthly review schedule.",
    category: "Governance",
    isCompleted: false,
    responsibleRole: "Project Sponsor"
  },
  {
    id: 11,
    phase: "2. Governance & Charter",
    phaseId: 2,
    title: "Stakeholder Register & Influence Matrix",
    description: "Identified all internal and external stakeholders categorized by Power and Interest.",
    category: "Stakeholders",
    isCompleted: false,
    responsibleRole: "Project Manager"
  },
  {
    id: 12,
    phase: "2. Governance & Charter",
    phaseId: 2,
    title: "Pre-Project Alignment Minutes of Meeting (MoM)",
    description: "Recorded consensus and action items from preliminary stakeholder kick-off alignment.",
    category: "Governance",
    isCompleted: false,
    responsibleRole: "PMO Secretary"
  },

  // Phase 3: Scope, WBS & Technical Specifications (13 - 18)
  {
    id: 13,
    phase: "3. Scope & Engineering Specs",
    phaseId: 3,
    title: "Project Scope Statement (In / Out-of-Scope)",
    description: "Explicit delineation of boundaries to prevent unauthorized scope creep.",
    category: "Scope",
    isCompleted: false,
    responsibleRole: "Project Manager"
  },
  {
    id: 14,
    phase: "3. Scope & Engineering Specs",
    phaseId: 3,
    title: "Level 1 to Level 6 WBS Breakdown",
    description: "Decomposed work packages from Level 1 program down to Level 6 verifiable deliverable tasks.",
    category: "Scope",
    isCompleted: false,
    responsibleRole: "PMO Planner"
  },
  {
    id: 15,
    phase: "3. Scope & Engineering Specs",
    phaseId: 3,
    title: "Technical Specifications & Terms of Reference (TOR)",
    description: "Engineering and functional criteria specifying deliverable performance standards.",
    category: "Technical",
    isCompleted: false,
    responsibleRole: "Technical Lead"
  },
  {
    id: 16,
    phase: "3. Scope & Engineering Specs",
    phaseId: 3,
    title: "Preliminary Architecture / Engineering Drawings",
    description: "Validated architectural schematics, civil blueprints, or IT system diagrams.",
    category: "Technical",
    isCompleted: false,
    responsibleRole: "Chief Architect / Chief Engineer"
  },
  {
    id: 17,
    phase: "3. Scope & Engineering Specs",
    phaseId: 3,
    title: "Quality Standards & Acceptance Criteria",
    description: "Checklist of quantitative acceptance test criteria for milestone sign-offs.",
    category: "Quality",
    isCompleted: false,
    responsibleRole: "QA Manager"
  },
  {
    id: 18,
    phase: "3. Scope & Engineering Specs",
    phaseId: 3,
    title: "Work Package Definition Sheets (WPDS)",
    description: "Granular sheets defining inputs, outputs, deliverables, and acceptance for each major WP.",
    category: "Scope",
    isCompleted: false,
    responsibleRole: "Work Package Leads"
  },

  // Phase 4: Procurement, Legal & Contracts (19 - 24)
  {
    id: 19,
    phase: "4. Procurement & Legal",
    phaseId: 4,
    title: "Procurement Strategy & Sourcing Plan",
    description: "Make-vs-buy decisions, bidding strategy, contract type (Fixed Price / Time & Materials).",
    category: "Procurement",
    isCompleted: false,
    responsibleRole: "Procurement Lead"
  },
  {
    id: 20,
    phase: "4. Procurement & Legal",
    phaseId: 4,
    title: "RFP / Tender Documentation Package",
    description: "Compiled Request for Proposal (RFP) documentation with scoring rubric.",
    category: "Procurement",
    isCompleted: false,
    responsibleRole: "Procurement Officer"
  },
  {
    id: 21,
    phase: "4. Procurement & Legal",
    phaseId: 4,
    title: "Vendor Shortlist & Evaluation Criteria",
    description: "Vetted qualification standards, compliance checks, and shortlist ranking.",
    category: "Procurement",
    isCompleted: false,
    responsibleRole: "Tender Committee"
  },
  {
    id: 22,
    phase: "4. Procurement & Legal",
    phaseId: 4,
    title: "Non-Disclosure Agreement (NDA) Execution",
    description: "Mutual confidentiality agreements executed with all shortlisted external vendors.",
    category: "Legal",
    isCompleted: false,
    responsibleRole: "Legal Counsel"
  },
  {
    id: 23,
    phase: "4. Procurement & Legal",
    phaseId: 4,
    title: "Master Service Agreement (MSA) / Contract Draft",
    description: "Standard contract draft including SLA, payment terms, and liquidated damages.",
    category: "Legal",
    isCompleted: false,
    responsibleRole: "Legal Counsel"
  },
  {
    id: 24,
    phase: "4. Procurement & Legal",
    phaseId: 4,
    title: "Regulatory & Statutory Compliance Clearance",
    description: "Legal clearance verifying compliance with local labor, environmental, and industry laws.",
    category: "Compliance",
    isCompleted: false,
    responsibleRole: "Compliance Officer"
  },

  // Phase 5: Resource, Schedule & Financial Baseline (25 - 30)
  {
    id: 25,
    phase: "5. Schedule & Resource Baseline",
    phaseId: 5,
    title: "Critical Path Method (CPM) Baseline Schedule",
    description: "Network diagram verified with calculated Early/Late dates, Slack, and critical path duration.",
    category: "Schedule",
    isCompleted: false,
    responsibleRole: "Lead Scheduler"
  },
  {
    id: 26,
    phase: "5. Schedule & Resource Baseline",
    phaseId: 5,
    title: "Human Resource Allocation & Staffing Plan",
    description: "Secured key personnel commitments, FTE ratios, and resource ramp-up schedule.",
    category: "Resource",
    isCompleted: false,
    responsibleRole: "Resource Manager"
  },
  {
    id: 27,
    phase: "5. Schedule & Resource Baseline",
    phaseId: 5,
    title: "Equipment & Machinery Availability Plan",
    description: "Mobilization schedule for critical machinery, tools, or computing infrastructure.",
    category: "Resource",
    isCompleted: false,
    responsibleRole: "Operations Lead"
  },
  {
    id: 28,
    phase: "5. Schedule & Resource Baseline",
    phaseId: 5,
    title: "Cash Flow Projection & Milestone Drawdowns",
    description: "Monthly expenditure curves (S-Curve baseline) aligned with funding disbursement tranches.",
    category: "Financial",
    isCompleted: false,
    responsibleRole: "Project Accountant"
  },
  {
    id: 29,
    phase: "5. Schedule & Resource Baseline",
    phaseId: 5,
    title: "RACI Responsibility Matrix Finalized",
    description: "Clear assignment of Responsible, Accountable, Consulted, and Informed parties per WP.",
    category: "Governance",
    isCompleted: false,
    responsibleRole: "Project Manager"
  },
  {
    id: 30,
    phase: "5. Schedule & Resource Baseline",
    phaseId: 5,
    title: "Site / Environment Readiness Verification",
    description: "Physical work site access, power/water utilities, or cloud virtual private network readiness.",
    category: "Infrastructure",
    isCompleted: false,
    responsibleRole: "Site Supervisor"
  },

  // Phase 6: Risk, Safety & Communication (31 - 36)
  {
    id: 31,
    phase: "6. Risk, HSE & Communication",
    phaseId: 6,
    title: "Pre-Project Risk Register & Mitigation Plans",
    description: "Identified top project risks scored by Probability and Impact with assigned risk owners.",
    category: "Risk",
    isCompleted: false,
    responsibleRole: "Risk Officer"
  },
  {
    id: 32,
    phase: "6. Risk, HSE & Communication",
    phaseId: 6,
    title: "HSE (Health, Safety & Environment) Plan",
    description: "Emergency protocols, PPE requirements, safety hazard assessments, and zero-accident target.",
    category: "HSE",
    isCompleted: false,
    responsibleRole: "Safety Officer"
  },
  {
    id: 33,
    phase: "6. Risk, HSE & Communication",
    phaseId: 6,
    title: "Change Management Strategy Plan",
    description: "Framework for managing organizational change, user adoption, and training pathways.",
    category: "Change",
    isCompleted: false,
    responsibleRole: "Change Manager"
  },
  {
    id: 34,
    phase: "6. Risk, HSE & Communication",
    phaseId: 6,
    title: "Communication & Status Reporting Plan",
    description: "Defined frequency, channels, audience, and templates for weekly/monthly status reports.",
    category: "Communication",
    isCompleted: false,
    responsibleRole: "PMO Coordinator"
  },
  {
    id: 35,
    phase: "6. Risk, HSE & Communication",
    phaseId: 6,
    title: "Issue Escalation Matrix & SLA Protocol",
    description: "Tiered escalation paths (L1 PM -> L2 PMO Head -> L3 Steering Committee) with resolution SLAs.",
    category: "Governance",
    isCompleted: false,
    responsibleRole: "Project Manager"
  },
  {
    id: 36,
    phase: "6. Risk, HSE & Communication",
    phaseId: 6,
    title: "Environmental & Permitting Clearance (AMDAL/UKL-UPL)",
    description: "Approved government environmental permits and community impact clearances.",
    category: "Compliance",
    isCompleted: false,
    responsibleRole: "Liaison Officer"
  },

  // Phase 7: Final Pre-Project Gate Review & Authorization (37 - 40)
  {
    id: 37,
    phase: "7. Final Stage Gate Review & NTP",
    phaseId: 7,
    title: "Pre-Mortem Failure Simulation Session",
    description: "Cross-functional prospective hindsight exercise to anticipate and prevent failure modes.",
    category: "Quality",
    isCompleted: false,
    responsibleRole: "PMO Facilitator"
  },
  {
    id: 38,
    phase: "7. Final Stage Gate Review & NTP",
    phaseId: 7,
    title: "Pre-Project Stage Gate Review Dossier",
    description: "Audit compilation of all readiness criteria for presentation to Steering Committee.",
    category: "Audit",
    isCompleted: false,
    responsibleRole: "Lead Auditor"
  },
  {
    id: 39,
    phase: "7. Final Stage Gate Review & NTP",
    phaseId: 7,
    title: "Executive Sponsor Final Go/No-Go Decision",
    description: "Formal recorded verdict authorizing transition from Pre-Project to Active Execution.",
    category: "Executive",
    isCompleted: false,
    responsibleRole: "Executive Sponsor"
  },
  {
    id: 40,
    phase: "7. Final Stage Gate Review & NTP",
    phaseId: 7,
    title: "Official Notice to Proceed (NTP) / Kick-off Order",
    description: "Contractual directive issued to project team and vendors to commence execution work.",
    category: "Execution",
    isCompleted: false,
    responsibleRole: "Head of PMO / Sponsor"
  }
];
