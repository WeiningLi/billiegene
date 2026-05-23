import { useState, useEffect } from "react";
import { mRNAConstruct, EpitopeCandidate } from "../types";
import { Copy, ShieldCheck, Download, Disc, HelpCircle, FileText, Check, AlertTriangle } from "lucide-react";

interface StepmRNADesignProps {
  selectedEpitopes: EpitopeCandidate[];
}

export default function StepmRNADesign({ selectedEpitopes }: StepmRNADesignProps) {
  const [linkerType, setLinkerType] = useState<'GGSGG' | 'EAAAK' | 'AYAAA'>('GGSGG');
  const [codonOpt, setCodonOpt] = useState<'HomoSapiens' | 'Murine' | 'None'>('HomoSapiens');
  const [activeSegment, setActiveSegment] = useState<string>("Epitope 1");
  const [copied, setCopied] = useState<boolean>(false);

  // Derive dynamic construct properties based on active inputs
  const epitopeIds = selectedEpitopes.map(e => e.id);
  const count = selectedEpitopes.length;

  const getLinkerSequence = () => {
    if (linkerType === 'GGSGG') return "GGTGGCAGCGGTGGC";
    if (linkerType === 'EAAAK') return "GAAGCCGCCGCTAAA";
    return "GCCTACGCAGCCGCA";
  };

  const getEpitopeMockSequence = (id: string) => {
    // Elegant fasta mapping mocks
    const hash = id.split('-')[2] || "001";
    return `AUGGGCCGCA${hash}CAGUCAGCGCUG`;
  };

  // Compile full synthetic nucleoside sequence string
  const compileSequence = () => {
    const Cap = "m7GpppG5'--";
    const fiveUtr = "GGAGACCAAGCUGGGAGACCAAGCUGUGGCCCCAACCGGGCCA";
    const signalSub = "AUGAAAACGAUCAUUGCCCUGCUCUACGCUUUCCUGCUGGUC";
    const threeUtr = "UGAUAAGCUUGCGAUCCUCGAGCGGCUCGUGGCCAAUGGCGGGG";
    const polyA = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    const linkSeq = getLinkerSequence();
    const epitSeqArr = selectedEpitopes.map(e => getEpitopeMockSequence(e.id));
    const midString = epitSeqArr.join(linkSeq);

    return `${Cap}${fiveUtr}-${signalSub}-${midString || "AUGGACCUA"}-${threeUtr}-${polyA}`;
  };

  const constructSeq = compileSequence();
  const constructLength = constructSeq.replace(/['\-]/g, "").length;

  // Compute stats dynamically
  const gcContent = Math.min(65, Math.max(45, 48 + (linkerType === 'GGSGG' ? 4 : 2) + (codonOpt === 'HomoSapiens' ? 3 : 0)));
  const codonAdaptation = codonOpt === 'HomoSapiens' ? 0.94 : codonOpt === 'Murine' ? 0.86 : 0.65;
  const manufacturabilityScore = Math.round(
    (codonAdaptation * 40) + 
    (100 - gcContent) * 0.4 + 
    (count > 0 ? 30 : 10) + 
    (linkerType === 'GGSGG' ? 10 : 8)
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(constructSeq);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="step-mrna-design">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Step 05 — mRNA Construct Design</h2>
        <p className="text-xs text-zinc-400">
          Synthesize and align a multi-epitope construct planner with targeted signal sequences, linkers, and Poly(A) tails.
        </p>
      </div>

      {/* CONSTRUCT CONFIGURATIONS CONTROLS */}
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Linker Selection (Flexible vs Structural)</span>
            <p className="text-[11px] text-zinc-400 mt-0.5">Cleavable linking residues keep peptides structurally separated inside host cells.</p>
          </div>
          <div className="flex bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 gap-1.5">
            {(['GGSGG', 'EAAAK', 'AYAAA'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLinkerType(l)}
                className={`flex-1 rounded py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  linkerType === l ? "bg-emerald-500 text-zinc-950 font-black" : "text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Codon Optimization Strategy</span>
            <p className="text-[11px] text-zinc-400 mt-0.5">Optimizes host cell tRNA adaptation to ensure maximum translation velocity.</p>
          </div>
          <div className="flex bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 gap-1.5">
            {[
              { id: 'HomoSapiens', label: 'H. Sapiens' },
              { id: 'Murine', label: 'Murine (Model)' },
              { id: 'None', label: 'Raw Unoptimized' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCodonOpt(c.id as any)}
                className={`flex-1 rounded py-2 text-[10.5px] font-semibold transition ${
                  codonOpt === c.id ? "bg-emerald-500 text-zinc-950 font-black" : "text-zinc-400 hover:bg-zinc-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTERACTIVE CONSTRUCT VISUAL RIBBON */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Interactive construct layout</span>
          <h3 className="text-xs font-bold text-zinc-200">Segmental Splicing Architecture</h3>
        </div>

        {/* The Ribbon grid layout */}
        <div className="flex flex-col gap-1 sm:flex-row shadow-lg rounded-xl overflow-hidden border border-zinc-900 select-none">
          <button 
            onClick={() => setActiveSegment("Cap")}
            className={`px-3 py-3 text-xs font-sans text-center transition ${activeSegment === "Cap" ? "bg-amber-500 text-zinc-950 font-bold flex-[1.1]" : "bg-zinc-900/40 hover:bg-zinc-900 text-amber-200"}`}
          >
            5' Cap
          </button>
          
          <button 
            onClick={() => setActiveSegment("fiveUtr")}
            className={`px-3 py-3 text-xs font-sans text-center transition ${activeSegment === "fiveUtr" ? "bg-blue-500 text-zinc-950 font-bold flex-[1.1]" : "bg-zinc-900/50 hover:bg-zinc-900 text-blue-200"}`}
          >
            5' UTR
          </button>

          <button 
            onClick={() => setActiveSegment("Signal")}
            className={`px-3 py-3 text-xs font-sans text-center transition ${activeSegment === "Signal" ? "bg-emerald-600 text-white font-bold flex-[1.1]" : "bg-zinc-900/60 hover:bg-zinc-900 text-emerald-300"}`}
          >
            Signal Peptide
          </button>

          {selectedEpitopes.length === 0 ? (
            <div className="flex-[4] bg-zinc-950 border border-dashed border-red-500/20 py-3 text-center text-[10px] text-red-400 flex items-center justify-center">
              ▲ No epitopes selected! Go back to Step 04 and select at least one epitope.
            </div>
          ) : (
            selectedEpitopes.map((epi, idx) => (
              <div key={epi.id} className="flex-[3] flex flex-col sm:flex-row gap-0.5">
                <button 
                  onClick={() => setActiveSegment(epi.id)}
                  className={`px-2 py-3 text-[10px] font-mono whitespace-nowrap text-center transition flex-1 truncate ${
                    activeSegment === epi.id ? "bg-purple-600 text-white font-bold" : "bg-purple-500/15 hover:bg-purple-500/25 text-purple-200"
                  }`}
                >
                  {epi.id}
                </button>
                {idx < selectedEpitopes.length - 1 && (
                  <button 
                    onClick={() => setActiveSegment(`Linker ${idx + 1}`)}
                    className={`px-2 py-3 text-[10px] font-mono text-center transition ${
                      activeSegment === `Linker ${idx + 1}` ? "bg-zinc-100 text-zinc-955 font-bold" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {linkerType}
                  </button>
                )}
              </div>
            ))
          )}

          <button 
            onClick={() => setActiveSegment("threeUtr")}
            className={`px-3 py-3 text-xs font-sans text-center transition ${activeSegment === "threeUtr" ? "bg-indigo-500 text-zinc-950 font-bold" : "bg-zinc-900/50 hover:bg-zinc-900 text-indigo-200"}`}
          >
            3' UTR
          </button>

          <button 
            onClick={() => setActiveSegment("PolyA")}
            className={`px-3 py-3 text-xs font-sans text-center transition ${activeSegment === "PolyA" ? "bg-zinc-100 text-zinc-950 font-bold flex-[1.3]" : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300"}`}
          >
            Poly(A) Array
          </button>
        </div>

        {/* Dynamic Detail Card describing selected construct piece */}
        <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/80 p-4 text-xs font-mono space-y-1 text-zinc-300">
          <div className="flex items-center gap-2 text-white font-bold border-b border-zinc-900 pb-2 mb-2">
            <Disc className="h-4.5 w-4.5 text-purple-400" />
            <span>Active Segment Detail: {activeSegment}</span>
          </div>
          {activeSegment === "Cap" && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>5' Cap structural element:</strong> Incorporates synthetic m7G(5')ppp(5')G cap analog structure which shields the synthetic translation bundle from exonuclease breakdown while facilitating translation boot sequences via eIF4E transcription complexes.
            </p>
          )}
          {activeSegment === "fiveUtr" && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>5' Untranslated Region (UTR):</strong> Boosts transcription initiation efficiency. Includes a Kozak reference pattern (GCCACCAUGG) to configure optimized ribosome load rates to achieve maximum protein translation counts inside localized tissues.
            </p>
          )}
          {activeSegment === "Signal" && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>Signal peptide sequences:</strong> Configures cell secretion kinetics. Directs newly translated multiepitopic antigens into human cellular secretory routes, encouraging proper extracellular export and surface visual presence in nearby lymph networks.
            </p>
          )}
          {activeSegment.startsWith("BG-") && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>Active Epitopic Target:</strong> Multi-epitope segment predicted to act as a highly immunogenic binding motif. This segment binds MHC and triggers precise, targeted activation of adaptive immune lymphocytes without carrying viral payload structures.
            </p>
          )}
          {activeSegment.startsWith("Linker") && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>Flexible Linker Bundle:</strong> Synthesised GGSGG motifs sequence preventing steric collision between neighboring epitopes, assuring independent, correct molecular folding.
            </p>
          )}
          {activeSegment === "threeUtr" && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>3' Untranslated Region (UTR):</strong> Stabilizes the transcript during localization. Incorporates high-density regulatory fragments that inhibit early deadenylation, increasing half-life within active cellular cytoplasm to increase immunogenicity profiles.
            </p>
          )}
          {activeSegment === "PolyA" && (
            <p className="text-zinc-400 leading-normal font-sans">
              <strong>120nt synthetic tail array:</strong> Dictates overall transcriptional longevity. Provides robust shelter against standard ribonuclease decay pathways, allowing ribosomal engines to repeatedly cycle through sequences before clearance.
            </p>
          )}
        </div>
      </div>

      {/* METRICS & EXPORT OPTIONS PANELS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Metric indicators */}
        <div className="lg:col-span-2 space-y-3.5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Construct Diagnostics & Verification</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Structural Stability Profile</span>
              
              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between font-mono">
                  <span>GC Target Content:</span>
                  <strong className="text-emerald-400">{gcContent}% (Ideal bounds: 45%-60%)</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Codon Adaptation Index (CAI):</span>
                  <strong className="text-emerald-400">{codonAdaptation} (Excellent)</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Repeat Motif Risk:</span>
                  <strong className="text-emerald-400">Low</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Secondary Structure Free Loop:</span>
                  <strong className="text-white">Medium Risk (-124.5 kcal)</strong>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Translation Properties</span>

              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between font-mono">
                  <span>Translation Integrity:</span>
                  <strong className="text-emerald-400 inline-flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> PASS
                  </strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Target Construct length:</span>
                  <strong className="text-white">{constructLength} nt</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Linker Compatibility:</span>
                  <strong className="text-emerald-400">100% Cleaved</strong>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Manufacturability Score:</span>
                  <strong className="text-emerald-400">{manufacturabilityScore} / 100</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Translation sequence display */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Nucleotide Splicing Preview</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] bg-zinc-900 px-2 py-1 rounded text-zinc-400 hover:text-white transition"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? "Copied!" : "Copy FASTA transcript"}</span>
              </button>
            </div>
            <div className="rounded bg-zinc-950 p-2.5 border border-zinc-900 max-h-36 overflow-y-auto">
              <code className="text-[10.5px] font-mono text-zinc-400 leading-normal break-all font-semibold">
                {constructSeq}
              </code>
            </div>
          </div>
        </div>

        {/* Export panels / Right side */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Deploy & Export Options</h3>
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Simulation Workspace Settings</span>

            <button 
              disabled 
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800/80 px-4 py-3 text-xs font-semibold text-zinc-500 border border-zinc-750 cursor-not-allowed"
            >
              <Download className="h-4.5 w-4.5" />
              Download Wet-Lab FASTA Target
            </button>
            
            <button 
              disabled 
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800/80 px-4 py-3 text-xs font-semibold text-zinc-500 border border-zinc-750 cursor-not-allowed"
            >
              <FileText className="h-4.5 w-4.5" />
              Export Plasmid Map (GenBank)
            </button>

            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-[11px] leading-relaxed text-red-400/90 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 font-bold text-red-400 uppercase tracking-wider">
                <AlertTriangle className="h-4.5 w-4.5 text-red-550" />
                <span>Export Limitation</span>
              </div>
              <p className="leading-normal">
                Wet-lab output generators and sequence downloads are disabled within this public prototype interface in accordance with absolute safety regulations regarding genetic syntheses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
