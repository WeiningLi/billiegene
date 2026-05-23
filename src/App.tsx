import React, { useState } from "react";
import { 
  Dna, 
  Map, 
  Tag, 
  Search, 
  Cpu, 
  Activity, 
  FileCheck, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Bot,
  MessageSquare,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Sliders,
  Compass,
  ArrowLeft
} from "lucide-react";

import Header from "./components/Header";
import AgentWorkbench from "./components/AgentWorkbench";
import CopilotCard from "./components/CopilotCard";
import StepSequenceInput from "./components/StepSequenceInput";
import StepSurfaceDiscovery from "./components/StepSurfaceDiscovery";
import StepFunctionAnnotation from "./components/StepFunctionAnnotation";
import StepEpitopePrediction from "./components/StepEpitopePrediction";
import StepmRNADesign from "./components/StepmRNADesign";
import StepRiskScreen from "./components/StepRiskScreen";
import StepReport from "./components/StepReport";

import { PathogenInput, SequenceStats, ProteinDomain, MutationHotspot, GlycosylationSite, EpitopeCandidate } from "./types";

const WORKSPACE_TABS = [
  { 
    id: 1, 
    label: "Genomics & Scan", 
    icon: Dna, 
    summary: "FASTA codon input, live six-frame scanner, and homology alignment maps" 
  },
  { 
    id: 2, 
    label: "3D Structure Mapping", 
    icon: Sparkles, 
    summary: "ESMFold 3D simulation, mutation density, and glycosylation shields" 
  },
  { 
    id: 3, 
    label: "Annotation & Epitopes", 
    icon: Map, 
    summary: "Developability viability score annotation and immune CD4/CD8 epitope targets" 
  },
  { 
    id: 4, 
    label: "Synthesis & Safety", 
    icon: Cpu, 
    summary: "mRNA transcript optimization, clinical risk scores, and final report" 
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<'pipeline' | 'agents'>(
    window.location.pathname.startsWith('/agents') ? 'agents' : 'pipeline'
  );
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(true); // Drawer state for the AI Assistant

  // Biological alignments global tracker states
  const [pathogenInput, setPathogenInput] = useState<PathogenInput>({
    sequence: `>hCoV-19/SARS-CoV-2/spike/Omicron-BA.5
ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAATCTTACAACCAGAACTCAATTACCCCCTGC
ATACACTAATTCTTTCACACGTGGTGTTTATTACCCTGACAAAGTTTTCAGATCCTCAGTTTTACATTCAACTCAGGACT
TGTTCTTACCTTTCTTTTCCAATGTTACTTGGTTCCATGCTATACATGTCTCTGGGACCAATGGTACTAAGAGGTTTGAT
AACCCTGTCCTACCATTTAATGATGGTGTTTATTTTGCTTCCACTGAGAAGTCTAACATAATAAGAGGCTGGATTTTTGG
TACTACTTTAGATTCGAAGACCCAGTCCCTACTTATTGTTAATAACGCTACTAATGTTGTTATTAAAGTCTGTGAATTTC
AATTTTGTAATGATCCATTTTTGGGTGTTTATTACCACAAAAACAACAAAAGTTGGATGGAAAGTGAGTTCAGAGTTTAT
TCTAGTGCGAATAATTGCACTTTTGAATATGTCTCTCAGCCTTTTCTTATGGACCTTGAAGGAAAACAGGGTAATTTCAA
AAATCTTAGGGAATTTGTGTTTAAGAATATTGATGGTTATTTTAAAATATATTCTAAGCACACGCCTATTAATTTAGTGC
GTGATCTCCCTCAGGGTTTTTCGGCTTTAGAACCATTGGTAGATTTACCAATAGGCATTAACATCACTAGGTTTCAAACT
TTACTTGCTTTACATAGAAGTTATTTGACTCCTGGTGATTCTTCTTCAGGTTGGACAGCTGGTAGTGCAG`,
    type: "fasta",
    pathogenType: "Coronaviridae",
    referenceStrain: "sars_cov_2"
  });

  const [sequenceStats, setSequenceStats] = useState<SequenceStats | null>({
    length: 1273,
    gcContent: 37.8,
    orfCount: 11,
    predictedRegionsCount: 4,
    confidence: 96,
    validated: true,
    warnings: ["High mutation density observed in Receptor Binding Domain (R RBD)."]
  });

  const [pathogenName, setPathogenName] = useState<string>("SARS-CoV-2 (Spike Glycoprotein)");
  const [pathogenKey, setPathogenKey] = useState<string>("sars_cov_2");

  // Core visual data alignments
  const [domains, setDomains] = useState<ProteinDomain[]>([
    { name: "Signal Peptide", start: 1, end: 12, color: "bg-blue-500", description: "Directs protein to endoplasmic reticulum/secretory pathway", type: "signal" },
    { name: "N-Terminal Domain (NTD)", start: 13, end: 340, color: "bg-emerald-500", description: "Surface exterior domain, moderate immune recognition", type: "extracellular" },
    { name: "Receptor Binding Domain (RBD)", start: 305, end: 543, color: "bg-purple-500", description: "Critical target: binds directly to human ACE2 receptor", type: "extracellular" },
    { name: "Fusion Peptide (FP)", start: 788, end: 806, color: "bg-amber-500", description: "Mediates viral and host membrane fusion", type: "extracellular" },
    { name: "Heptad Repeat 1 & 2 (HR)", start: 912, end: 1162, color: "bg-cyan-500", description: "Structural fusion core machinery, highly conserved across strains", type: "extracellular" },
    { name: "Transmembrane Region (TM)", start: 1213, end: 1237, color: "bg-red-500", description: "Anchors the glycoprotein into the lipid double-layer", type: "transmembrane" },
    { name: "Cytoplasmic Tail", start: 1238, end: 1273, color: "bg-zinc-500", description: "Intracellular domain, facilitates viral assembly", type: "tail" }
  ]);

  const [mutations, setMutations] = useState<MutationHotspot[]>([
    { position: 417, original: "K", mutant: "N", frequency: 0.88, severity: "high" },
    { position: 484, original: "E", mutant: "K", frequency: 0.94, severity: "high" },
    { position: 501, original: "N", mutant: "Y", frequency: 0.98, severity: "medium" },
    { position: 614, original: "D", mutant: "G", frequency: 0.99, severity: "low" }
  ]);

  const [glycosylation, setGlycosylation] = useState<GlycosylationSite[]>([
    { position: 234, type: "N-linked", shieldingFactor: 0.8 },
    { position: 343, type: "N-linked", shieldingFactor: 0.75 },
    { position: 801, type: "N-linked", shieldingFactor: 0.4 }
  ]);

  const [epitopes, setEpitopes] = useState<EpitopeCandidate[]>([
    { id: "BG-EPI-001", region: "112–128", start: 112, end: 128, bindingScore: 91, mhcIBinding: 92, mhcIIBinding: 89, bCellScore: 93, surfaceExposure: "High", conservation: 88, populationCoverage: 81, escapeRisk: "Low", safetyScore: 94, decision: "Include" },
    { id: "BG-EPI-002", region: "308–322", start: 308, end: 322, bindingScore: 81, mhcIBinding: 83, mhcIIBinding: 79, bCellScore: 84, surfaceExposure: "High", conservation: 72, populationCoverage: 85, escapeRisk: "High", safetyScore: 88, decision: "Exclude" },
    { id: "BG-EPI-003", region: "411–427", start: 411, end: 427, bindingScore: 95, mhcIBinding: 96, mhcIIBinding: 94, bCellScore: 95, surfaceExposure: "High", conservation: 84, populationCoverage: 74, escapeRisk: "Medium", safetyScore: 90, decision: "Include" },
    { id: "BG-EPI-005", region: "601–615", start: 601, end: 615, bindingScore: 68, mhcIBinding: 71, mhcIIBinding: 65, bCellScore: 68, surfaceExposure: "Medium", conservation: 95, populationCoverage: 52, escapeRisk: "Low", safetyScore: 78, decision: "Exclude" },
    { id: "BG-EPI-006", region: "701–718", start: 701, end: 718, bindingScore: 87, mhcIBinding: 85, mhcIIBinding: 88, bCellScore: 82, surfaceExposure: "Medium", conservation: 91, populationCoverage: 89, escapeRisk: "Low", safetyScore: 96, decision: "Include" }
  ]);

  const handleSequenceAlignCallback = (data: { pathogenKey: string; stats: SequenceStats; domains: any[]; mutations: any[]; glycosylation: any[]; epitopes: any[] }) => {
    setPathogenKey(data.pathogenKey);
    setSequenceStats(data.stats);

    const namesMap: Record<string, string> = {
      sars_cov_2: "SARS-CoV-2 Spike Glycoprotein",
      influenza_h5n1: "Influenza H5N1 Hemagglutinin",
      zika_virus: "Zika Virus Envelope Glycoprotein"
    };
    setPathogenName(namesMap[data.pathogenKey] || "Custom Pathogen Alignment");

    if (data.domains && data.domains.length > 0) setDomains(data.domains);
    if (data.mutations) setMutations(data.mutations);
    if (data.glycosylation) setGlycosylation(data.glycosylation);
    if (data.epitopes) setEpitopes(data.epitopes);

    // Auto promote to Stage 2: Annotation & Epitope Selection
    setCurrentStep(2);
  };

  const onEpitopeToggle = (id: string) => {
    setEpitopes(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, decision: e.decision === 'Include' ? 'Exclude' : 'Include' };
      }
      return e;
    }));
  };

  const handleSaveInputFields = (input: PathogenInput) => {
    setPathogenInput(input);
  };

  const proteinLength = domains.length > 0 ? Math.max(...domains.map(d => d.end)) : 1273;
  const extracellularRatio = domains
    .filter(d => d.type === 'extracellular' || d.type === 'domain')
    .reduce((acc, d) => acc + (d.end - d.start), 0) / proteinLength;
  const calculatedExposure = Math.min(0.98, Number((extracellularRatio + 0.1).toFixed(2))) || 0.91;

  const activeSelectedEpitopes = epitopes.filter(e => e.decision === 'Include');

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100/90 font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-hidden" id="billie-gene-workspace">
      {/* GLOBAL TOP HEADER */}
      <Header />

      {/* COMPACT SUB-HEADER WORKSPACE MANAGER */}
      <div className="border-b border-zinc-900 bg-zinc-950 px-6 py-3.5 flex flex-wrap gap-4 items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-850 gap-1 shadow-inner">
            <button
              onClick={() => setActiveWorkspaceMode('pipeline')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold font-mono transition ${
                activeWorkspaceMode === 'pipeline'
                  ? "bg-emerald-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Diagnostic Pipeline</span>
            </button>
            <button
              onClick={() => setActiveWorkspaceMode('agents')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold font-mono transition ${
                activeWorkspaceMode === 'agents'
                  ? "bg-emerald-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4 text-emerald-400" />
              <span>Bio Agent Workbench</span>
            </button>
          </div>
        </div>

        {/* Dynamic Stepper tabs styled as elegant Segmented Control representing our simplified 3 stages */}
        {activeWorkspaceMode === 'pipeline' && (
          <div className="flex items-center bg-zinc-900/70 p-1 border border-zinc-850 rounded-xl gap-1">
            {WORKSPACE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === currentStep;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentStep(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold font-mono transition-all ${
                    isActive
                      ? "bg-zinc-800 text-emerald-400 shadow-md border border-zinc-700"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                  title={tab.summary}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-zinc-600"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Collapsible copilot drawer trigger */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold transition-all ${
              isCopilotOpen
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Copilot Sidebar</span>
            <span className={`h-2 w-2 rounded-full ${isCopilotOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`}></span>
          </button>
        </div>
      </div>

      {activeWorkspaceMode === 'agents' ? (
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          <AgentWorkbench />
        </div>
      ) : (
        /* streamlined workspace dashboard layout and modules */
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* MIDDLE COLUMN: STREAMLINED ACTIVE WORKSHEETS CONTROLLER */}
          <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-zinc-950/20">
            
            {/* STAGE 1: Genomics & live 6-frame scan */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Dna className="h-5 w-5 text-emerald-400" />
                    <span>Stage 1: Genomics Ingestion & Six-Frame Alignment Scan</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Input raw codon genomic sequences, trigger the six-frame translation scanner, and perform recursive alignment checks against standard pathogens.
                  </p>
                </div>

                <div className="max-w-5xl mx-auto">
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 shadow-2xl">
                    <StepSequenceInput 
                      onAnalyze={handleSequenceAlignCallback} 
                      savedInput={pathogenInput}
                      savedStats={sequenceStats}
                      onSaveInput={handleSaveInputFields}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: 3D Protein structure discovery mapping */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
                    <span>Stage 2: 3D Macromolecular Folding & Surface Topology Mapping</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Visualize 3D structures generated via ESMFold, and map out local mutation densities alongside glycosylation shield coordinates to lock developability.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 items-start">
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 shadow-2xl">
                    <StepSurfaceDiscovery 
                      domains={domains}
                      mutations={mutations}
                      glycosylation={glycosylation}
                      pathogenName={pathogenName}
                      dnaSequence={pathogenInput.sequence}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: Annotation & Epitope Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Map className="h-5 w-5 text-emerald-400" />
                    <span>Stage 3: Critical Developability Analysis & Epitope Selection</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Analyse composite developability scores (exposure, stability, and hydropathy) and screen vaccine-ready MHC-I/II CD4 & CD8 T-Cell target epitopes.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
                  <div className="xl:col-span-6">
                    {sequenceStats ? (
                      <StepFunctionAnnotation 
                        pathogenName={pathogenName}
                        exposureScore={calculatedExposure}
                      />
                    ) : (
                      <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-10 text-center text-zinc-550 space-y-2">
                        <AlertCircle className="h-8 w-8 text-zinc-600 mx-auto" />
                        <h4 className="text-xs font-bold text-zinc-400 font-mono text-center">Virulence Data Locked</h4>
                        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                          Analyze a valid DNA structure or preset target on the first stage to extract molecular folding calculations and surface exposures.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="xl:col-span-6">
                    <StepEpitopePrediction 
                      epitopes={epitopes}
                      onEpitopeToggle={onEpitopeToggle}
                      proteinLength={proteinLength}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: Synthetic Transcript Constructs & Clinical Safety Dossier */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-emerald-400" />
                    <span>Stage 4: mRNA Construct Synthesis & Safety Dossier</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Synthesize Optimized codons inside simulated ribosomes, cross-calculate autoimmune clinical risk profiles, and inspect printable candidate reports.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Top Split for mRNA Synthesis Design & Autoimmune Risk Safety */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <StepmRNADesign 
                      selectedEpitopes={activeSelectedEpitopes}
                    />
                    <StepRiskScreen 
                      selectedCount={activeSelectedEpitopes.length}
                    />
                  </div>

                  {/* Bottom Full-Width clinical final candidate report dossier */}
                  <div className="border-t border-zinc-900 pt-6">
                    <StepReport 
                      selectedEpitopes={activeSelectedEpitopes}
                      pathogenName={pathogenName}
                      exposureScore={calculatedExposure}
                      dnaSequence={pathogenInput.sequence}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LOWER CONTROLLER FOOTER */}
            <div className="flex items-center justify-between border-t border-zinc-900 pt-5 mt-[20px] shrink-0">
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(curr => Math.max(1, curr - 1))}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-805 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-350 hover:text-white transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous Stage</span>
                  </button>
                )}
              </div>

              <div>
                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(curr => Math.min(4, curr + 1))}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/10 active:scale-[0.99] cursor-pointer"
                  >
                    <span>Advance Stage</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4.5 py-2 select-none">
                    <Check className="h-4 w-4" />
                    <span>Formulation Matrix Confirmed</span>
                  </div>
                )}
              </div>
            </div>

          </main>

          {/* DUAL COLUMN RIGHT CO-PILOT WORKSPACE (Toggleable Side Drawer) */}
          {isCopilotOpen && (
            <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-zinc-900 bg-zinc-950/50 p-5 overflow-y-auto animate-fade-in relative z-10">
              <CopilotCard 
                stepId={currentStep}
                stepTitle={WORKSPACE_TABS[currentStep - 1]?.label || "Formulation Workspace"}
                stateData={{
                  pathogenName,
                  pathogenKey,
                  sequenceLength: sequenceStats?.length || 1273,
                  gcContent: sequenceStats?.gcContent || 38.4,
                  domainsCount: domains.length,
                  mutationsCount: mutations.length,
                  glycosylationCount: glycosylation.length,
                  totalEpitopes: epitopes.length,
                  selectedEpitopesCount: activeSelectedEpitopes.length,
                  selectedEpitopeIds: activeSelectedEpitopes.map(e => e.id)
                }}
              />
            </div>
          )}

        </div>
      )}
    </div>
  );
}
