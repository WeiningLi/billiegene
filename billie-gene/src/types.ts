export interface SubAgent {
  id: string;
  name: string;
  role: string;
  skills: string[];
  systemInstruction: string;
}

export interface AgentRunResult {
  id: string;
  name: string;
  output: string;
  latencyMs: number;
  skillsApplied: string[];
}

export interface WorkflowRun {
  id: string;
  timestamp: string;
  pathogenInput: string;
  virusType: string;
  coordinatorPlan: string;
  agentsRan: AgentRunResult[];
  masterDossier: string;
  parallelMode: boolean;
  totalTimeMs: number;
}

export interface PathogenPreset {
  title: string;
  virusType: string;
  description: string;
  sequence: string;
  notes: string;
  accessionId: string;
  orfCount: number;
}

export interface Epitope {
  id: string;
  region: string;
  start: number;
  end: number;
  sequence: string;
  bindingScore: number;
  mhc1Score: number;
  mhc2Score: number;
  bCellScore: number;
  exposure: "High" | "Medium" | "Low";
  conservation: number;
  escapeRisk: "Low" | "Medium" | "High";
  popCoverage: number;
  selected: boolean;
}

export interface ProteinFeature {
  name: string;
  start: number;
  end: number;
  color: string;
  score?: number;
  description: string;
}
