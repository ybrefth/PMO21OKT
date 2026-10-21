export interface ProjectCharterData {
  projectName: string;
  projectCode: string;
  projectSponsor: string;
  projectManager: string;
  startDate: string;
  targetEndDate: string;
  durationText: string;
  budgetEstimated: string; // e.g. "Rp 15 Miliar" or number formatted
  currency: string; // default "Rp"
  // Structured Sections matching Attachment 1:
  businessNeed: string; // 1. Business Need
  projectObjectives: string[]; // 2. Project Objectives
  inScope: string[]; // 3. In Scope
  outOfScope: string[]; // 3. Out of Scope
  keyDeliverables: string[]; // 4. Key Deliverables
  topRisks: string[]; // 5. Top Risks
  successCriteria: string[]; // 6. Success Criteria
  keyMilestones: MilestoneItem[]; // 7. Key Milestones
  stakeholders: StakeholderItem[]; // 8. Key Stakeholders
  selectedScopeCategories?: string[];
  scopeObjectives?: string;
  inScopeDeliverables?: string;
  outOfScopeExclusions?: string;
  keyAssumptions?: string;
  lastSaved?: string;
}

export interface MilestoneItem {
  id: string;
  no: number;
  milestone: string;
  targetDate: string;
}

export interface StakeholderItem {
  id: string;
  role: string; // e.g., 'Sponsor Proyek', 'Project Manager', 'Engineering Dept', etc.
  name: string;
  interest: string; // Peran / Kepentingan
  department?: string;
  email?: string;
  phone?: string;
}

export interface WBSNode {
  id: string;
  code: string; // e.g. "1.1", "1.1.1", "1.1.1.1", etc.
  level: number; // 1 to 6
  name: string;
  durationWeeks?: number; // duration in weeks
  pic?: string; // Penanggung Jawab (PIC)
  tool?: string; // Alat / Tool (untuk Level 5 & 6)
  material?: string; // Material / Dokumen / Sumber Daya (untuk Level 6)
  children?: WBSNode[];
  parentId?: string | null;
}

export interface CPMTask {
  id: string;
  name: string;
  duration: number; // in WEEKS (Minggu)
  predecessors: string[]; // task IDs, e.g. ["A", "B"]
  // Calculated fields (in WEEKS):
  es?: number; // Early Start (Minggu)
  ef?: number; // Early Finish (Minggu)
  ls?: number; // Late Start (Minggu)
  lf?: number; // Late Finish (Minggu)
  slack?: number; // Total Float / Buffer (Minggu)
  freeSlack?: number; // Free Float (Minggu)
  isCritical?: boolean;
}

export interface CPMCalculationResult {
  tasks: CPMTask[];
  criticalPath: string[]; // Task IDs on critical path in order
  totalDuration: number; // in Weeks
  targetDuration: number; // Target project duration in Weeks (set in advance)
  durationVariance: number; // Target - Critical Path (positive = ahead/buffer, negative = overrun)
  criticalTasksCount: number;
  nonCriticalTasksCount: number;
  averageSlack: number; // in Weeks
  crashingRecommendations: CrashingRecommendation[];
  hasCycle: boolean;
}

export interface CrashingRecommendation {
  taskId: string;
  taskName: string;
  currentDuration: number; // weeks
  recommendedMaxReduction: number; // weeks
  rationale: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
}

export interface ReadinessChecklistItem {
  id: number; // 1 to 40
  phase: string;
  phaseId: number;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  completedAt?: string; // ISO date string or formatted date
  notes?: string;
  responsibleRole?: string;
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  targetDurationWeeks?: number;
  charter: ProjectCharterData;
  wbsTree: WBSNode[];
  cpmTasks: CPMTask[];
  checklistItems: ReadinessChecklistItem[];
}

export interface WBSTemplateCategory {
  id: string;
  name: string;
  description: string;
  tree: WBSNode[];
}
