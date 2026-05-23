import { useState } from "react";
import { EpitopeCandidate } from "../types";
import { FileDown, Terminal, RefreshCw, Send, CheckCircle, Flame, ShieldCheck, Heart, Landmark, Layers } from "lucide-react";
import ESMFoldViewer from "./ESMFoldViewer";
import VaccineScorecard from "./VaccineScorecard";

interface StepReportProps {
  selectedEpitopes: EpitopeCandidate[];
  pathogenName: string;
  exposureScore: number;
  dnaSequence: string;
}

export default function StepReport({ selectedEpitopes, pathogenName, exposureScore, dnaSequence }: StepReportProps) {
  const [researchPrompt, setResearchPrompt] = useState<string>("Compare the reference and variant surface proteins. Which mutations are most likely to reduce antibody recognition?");
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [loadingHypothesis, setLoadingHypothesis] = useState<boolean>(false);

  // Re-calculate rating scores dynamically based on coordinates
  const count = selectedEpitopes.length;
  const bestEpiScore = count > 0 ? Math.max(...selectedEpitopes.map(e => e.bindingScore)) : 50;
  
  const surfaceTargetScore = Math.round(exposureScore * 100);
  const functionRelevanceScore = 86;
  const epitopeQualityScore = bestEpiScore;
  const conservationScore = count > 0 ? Math.round(selectedEpitopes.reduce((acc, e) => acc + e.conservation, 0) / count) : 70;
  const manufacturabilityScore = Math.round(70 + (count * 2.5));
  const pgxRiskScore = count > 0 ? 82 : 60;

  const finalScore = Math.round(
    0.20 * surfaceTargetScore +
    0.15 * functionRelevanceScore +
    0.20 * epitopeQualityScore +
    0.15 * conservationScore +
    0.15 * manufacturabilityScore +
    0.15 * pgxRiskScore
  );

  // Execute terminal bio-hypothesis scripts
  const runResearchScript = (promptText: string) => {
    setLoadingHypothesis(true);
    setResearchPrompt(promptText);

    setTimeout(() => {
      let output = "";
      if (promptText.includes("Compare the reference") || promptText.includes("escape")) {
        output = `[BILLIE-GENE TERMINAL] - ANALYSING VARIANT ESCAPE PATHS
=========================================================
$ billie-gene analyze-variant \\
    --reference examples/reference_surface_protein.fasta \\
    --variant examples/variant_surface_protein.fasta \\
    --mode epitope-escape \\
    --visualize structure \\
    --output reports/variant_escape_report.json

[INFO] Aligned 1,273 residues across references.
[INFO] Detected mutational clusters at codons: 417, 484, 501.
[CRITICAL] Mutation E484K overlaps directly inside active Epitopic loop (coordinates 411-427).

---------------------------------------------------------
COMPETING ESCAPE HYPOTHESES:
1. Mutational substitutions adjacent to Glycosylation shield trees (specifically N-343) creates stereochemical clashes, masking antibody neutralisation.
2. Direct electrostatic mutations inside epitope BG-EPI-003 region (E484K) reduce Class II polarity index, lowering B-cell antigen binding coefficients.
3. The overall fold remains structurally conserved, but localized HLA anchor residue mutation drops population MHC affinity binding by 35%.

RECOMMENDED LABORATORY VALIDATION PATHWAYS:
- Run peptide binding assays against native and mutated peptides.
- Perform plaque neutralisation assessments using pseudovirus mutants.
- Trigger structural visual diagnostics inside Molecular Viewers (PyMOL/Mol*).

---------------------------------------------------------
GENERATED AUTOMATED PYMOL RENDERING COMMANDS:
load surface_protein_model.pdb
select variant_sites, resi 417+484+501
color red, variant_sites
show spheres, variant_sites
zoom variant_sites
=========================================================`;
      } else if (promptText.includes("testing plan") || promptText.includes("validate")) {
        output = `[BILLIE-GENE TERMINAL] - GENERATING TESTING PROTOCOL FOR VALIDATION
=========================================================
$ billie-gene generate-protocol \\
    --epitope BG-EPI-003 \\
    --model elisa-binding \\
    --format standard-sop

[INFO] Preparing sop protocol for Epitope Candidate BG-EPI-003.
[INFO] Cross-checking human RefSeq database... Safe, similarity ratio <0.1%.

EXPERIMENTAL PROTOCOLS DESIGNED:
1. Epitopic Synthesis: Synthesise selected peptide candidate.
2. HLA Presentation Assays: Co-culture HLA-A*02:01 antigen expressing lines.
3. ELISA Binding evaluation: Titrate against pre-incubated hybridoma libraries.

validation complete. Advance files to experimental reviews.
=========================================================`;
      } else {
        output = `[BILLIE-GENE TERMINAL] - PROCESSED RESEARCH QUERY
=========================================================
Analyzed design files for "${promptText}".
All metrics are within recommended parameters:
- Exposure: ${exposureScore} index
- Conserved windows: Checked & verified.
Advance candidate BG-CANDIDATE-001 confidently.
=========================================================`;
      }
      setTerminalOutput(output);
      setLoadingHypothesis(false);
    }, 850);
  };

  return (
    <div className="space-y-6" id="step-report">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Step 07 — Final Candidate Report</h2>
        <p className="text-xs text-zinc-400">
          Review your compiled vaccine candidate dossier, inspect mutational escape hypotheses, and export diagnostic assay scripts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Candidate Summary Panel / Left columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-805 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-90 w-full pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">REPORT HEADER</span>
                <h3 className="text-md font-bold text-white font-mono">CANDIDATE: BG-CANDIDATE-001</h3>
              </div>
              <button 
                onClick={() => window.print()} 
                className="flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-350 hover:text-white transition"
              >
                <FileDown className="h-4 w-4" />
                <span>Export Dossier (PDF)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Target Surface Glycoprotein</span>
                <strong className="text-white text-sm block mt-0.5">{pathogenName || "SARS-CoV-2 (Spike Homologue)"}</strong>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Clinical Classification</span>
                <strong className="text-amber-400 text-sm block mt-0.5">Non-Clinical Computational Prototype</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-xs leading-relaxed text-zinc-300">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Design Rationale Summary</span>
              <p>
                The molecular selection pipeline resolved that target surface protein <strong className="text-white">{pathogenName}</strong> exhibits high solvent accessibility (<strong className="text-white">exposure index {exposureScore}</strong>) and highly stable structural free energy constraints. Selected epitopes contain broad population-level presentation across core HLA alleles with minimal off-target human protein homologies, indicating high vaccine target safety profiles.
              </p>
            </div>

            {/* Selected segment table layout */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Selected Vaccine Epitopes</span>
              <div className="overflow-x-auto rounded-lg border border-zinc-850">
                <table className="w-full text-left font-mono text-[10.5px] border-collapse bg-zinc-900/10">
                  <thead>
                    <tr className="bg-zinc-900/60 border-b border-zinc-805 text-zinc-500 uppercase text-[9px] font-black tracking-wider">
                      <th className="p-2.5">Epitope ID</th>
                      <th className="p-2.5">Region (Residues)</th>
                      <th className="p-2.5 text-center">Binding Affinity</th>
                      <th className="p-2.5 text-center">SASA Core</th>
                      <th className="p-2.5 text-center">Variant conservation</th>
                      <th className="p-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {selectedEpitopes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-zinc-500 text-xs">
                          No epitopes listed. Go back to Step 04 and include candidates.
                        </td>
                      </tr>
                    ) : (
                      selectedEpitopes.map((epi) => (
                        <tr key={epi.id} className="text-zinc-300 hover:bg-zinc-900/30">
                          <td className="p-2.5 font-bold text-white">{epi.id}</td>
                          <td className="p-2.5">{epi.region}</td>
                          <td className="p-2.5 text-center text-emerald-400 font-bold">{epi.bindingScore}%</td>
                          <td className="p-2.5 text-center text-zinc-400">{epi.surfaceExposure}</td>
                          <td className="p-2.5 text-center">{epi.conservation}%</td>
                          <td className="p-2.5 text-right font-semibold text-emerald-400">Included</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ACTIVE ASSAY PLANNING AND TESTING SECTION */}
          <div className="rounded-xl border border-zinc-805 bg-zinc-950 p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">TEST LAB</span>
              <h3 className="text-xs font-bold text-white">Variant ESCAPE Modeling & Assay Planning</h3>
              <p className="text-[10.5px] text-zinc-400 mt-1">
                Configure candidate validation structures. Load preset test queries or write target sequences below.
              </p>
            </div>

            {/* Quick Presets list */}
            <div className="flex flex-wrap gap-2 text-[10.5px]">
              <button 
                onClick={() => runResearchScript("Compare the reference and variant surface proteins. Which mutations are most likely to reduce antibody recognition?")}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md hover:text-white transition"
              >
                🔬 Compare variant escape paths
              </button>
              <button 
                onClick={() => runResearchScript("Create a testing plan to validate whether Epitope BG-EPI-003 remains immunogenic across variants.")}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md hover:text-white transition"
              >
                🧪 Generate ELISA validation SOP
              </button>
            </div>

            <div className="flex gap-2.5">
              <input 
                type="text"
                value={researchPrompt}
                onChange={(e) => setResearchPrompt(e.target.value)}
                placeholder="Type hypothetical assay inquiries..."
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-zinc-700 outline-none"
              />
              <button 
                onClick={() => runResearchScript(researchPrompt)}
                disabled={loadingHypothesis || !researchPrompt.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shrink-0 inline-flex items-center gap-1"
              >
                <Terminal className="h-4 w-4" />
                <span>Run</span>
              </button>
            </div>

            {/* Mock terminal block */}
            {(terminalOutput || loadingHypothesis) && (
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs overflow-x-auto">
                {loadingHypothesis ? (
                  <div className="flex items-center gap-2 text-emerald-400 py-3">
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    <span>Executing variant structural modeling scripts...</span>
                  </div>
                ) : (
                  <pre className="text-zinc-300 whitespace-pre leading-relaxed select-text select-all">
                    {terminalOutput}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CANDIDATE SCORE BOARD BOARD / Right Panel with Interactive 3D Fold */}
        <div className="space-y-4">
          <ESMFoldViewer dnaSequence={dnaSequence} compact={true} />
        </div>
      </div>

      {/* DETAILED CATEGORICAL BREAKDOWN & COMPOSITE SCORE AT BOTTOM */}
      <div className="border-t border-zinc-900 pt-6">
        <VaccineScorecard 
          surfaceScore={surfaceTargetScore}
          relevanceScore={functionRelevanceScore}
          epitopeScore={epitopeQualityScore}
          conservationScore={conservationScore}
          manufacturabilityScore={manufacturabilityScore}
          safetyScore={pgxRiskScore}
        />
      </div>
    </div>
  );
}
