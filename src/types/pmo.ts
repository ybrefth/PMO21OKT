export interface ProjectCharterData {
  projectName: string;
  projectCode: string;
  projectSponsor: string;
  projectManager: string;
  startDate: string;
  targetEndDate: string;
  budgetEstimated: string;
  currency: string;
  selectedScopeCategories: string[];
  scopeObjectives: string;
  inScopeDeliverables: string;
  outOfScopeExclusions: string;
  keyAssumptions: string;
  stakeholders: StakeholderItem[];
  lastSaved?: string;
}

export interface StakeholderItem {
  id: string;
  role: 'Sponsor' | 'Steering Committee' | 'PM' | 'Vendor' | 'End User' | 'Quality Lead' | 'Finance Lead';
  name: string;
  title: string;
  email: string;
  phone: string;
  department: string;
}

export interface WBSNode {
  id: string;
  code: string; // e.g., "1", "1.1", "1.1.2"
  level: number; // 1 to 6
  name: string;
  durationDays: number;
  assignedRole?: string;
  costEstimate?: number;
  children?: WBSNode[];
  parentId?: string | null;
}

export interface CPMTask {
  id: string;
  name: string;
  duration: number; // in days
  predecessors: string[]; // task IDs, e.g. ["A", "B"]
  // Calculated fields:
  es?: number; // Early Start
  ef?: number; // Early Finish
  ls?: number; // Late Start
  lf?: number; // Late Finish
  slack?: number; // Total Float
  freeSlack?: number; // Free Float
  isCritical?: boolean;
  crashPotentialDays?: number; // potential crashing days
}

export interface CPMCalculationResult {
  tasks: CPMTask[];
  criticalPath: string[]; // Task IDs on critical path in order
  totalDuration: number;
  criticalTasksCount: number;
  nonCriticalTasksCount: number;
  averageSlack: number;
  crashingRecommendations: CrashingRecommendation[];
  hasCycle: boolean;
}

export interface CrashingRecommendation {
  taskId: string;
  taskName: string;
  currentDuration: number;
  recommendedMaxReduction: number;
  rationale: string;
  priority: 'High' | 'Medium' | 'Low';
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
  charter: ProjectCharterData;
  wbsTree: WBSNode[];
  cpmTasks: CPMTask[];
  checklistItems: ReadinessChecklistItem[];
}

