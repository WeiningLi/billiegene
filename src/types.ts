export interface PathogenInput {
  sequence: string;
  type: 'fasta' | 'nucleotide' | 'protein_id';
  pathogenType: string;
  referenceStrain: string;
}

export interface SequenceStats {
  length: number;
  gcContent: number;
  orfCount: number;
  predictedRegionsCount: number;
  confidence: number;
  validated: boolean;
  warnings: string[];
}

export interface ProteinDomain {
  name: string;
  start: number;
  end: number;
  color: string;
  description: string;
  type: 'domain' | 'signal' | 'transmembrane' | 'tail' | 'extracellular';
}

export interface MutationHotspot {
  position: number;
  original: string;
  mutant: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
}

export interface GlycosylationSite {
  position: number;
  type: string;
  shieldingFactor: number;
}

export interface EpitopeCandidate {
  id: string;
  region: string;
  start: number;
  end: number;
  bindingScore: number;
  mhcIBinding: number;
  mhcIIBinding: number;
  bCellScore: number;
  surfaceExposure: 'High' | 'Medium' | 'Low';
  conservation: number;
  populationCoverage: number;
  escapeRisk: 'Low' | 'Medium' | 'High';
  safetyScore: number;
  decision: 'Include' | 'Exclude';
}

export interface AnnotationMetric {
  name: string;
  value: string | number;
  meaning: string;
  importance: string;
  score: number;
}

export interface mRNAConstruct {
  id: string;
  selectedEpitopes: string[];
  length: number;
  gcContent: number;
  codonAdaptation: number;
  repeatRisk: 'Low' | 'Medium' | 'High';
  secondaryStructureRisk: 'Low' | 'Medium' | 'High';
  translationIntegrity: 'Pass' | 'Fail';
  manufacturabilityScore: number;
  sequencePreview: string;
}

export interface RiskScreenResult {
  predictedCoverage: number;
  lowResponseRisk: 'Low' | 'Moderate' | 'High';
  autoimmunityFlag: boolean;
  similarityNotes: string;
  confidence: 'High' | 'Medium' | 'Low';
  hlaAlleles: { allele: string; frequency: number; bindingAffinity: string; riskSymbol: string }[];
}

export interface HypothesisOutput {
  id: string;
  hypothesis: string;
  mechanism: string;
  testingPlan: string;
  pymolCommand: string;
}
