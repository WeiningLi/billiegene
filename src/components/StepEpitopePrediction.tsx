import { useState } from "react";
import { EpitopeCandidate } from "../types";
import { Table, Eye, EyeOff, Check, X, ShieldAlert, SlidersHorizontal, Info } from "lucide-react";

interface StepEpitopePredictionProps {
  epitopes: EpitopeCandidate[];
  onEpitopeToggle: (id: string) => void;
  proteinLength: number;
}

export default function StepEpitopePrediction({ epitopes, onEpitopeToggle, proteinLength }: StepEpitopePredictionProps) {
  const [minScore, setMinScore] = useState<number>(75);
  const [excludeHighRisk, setExcludeHighRisk] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'all' | 'included'>('all');

  // Filter candidates dynamically based on user controls
  const filteredEpitopes = epitopes.filter(epi => {
    if (epi.bindingScore < minScore) return false;
    if (excludeHighRisk && epi.escapeRisk === 'High') return false;
    if (viewMode === 'included' && epi.decision !== 'Include') return false;
    return true;
  });

  return (
    <div className="space-y-6" id="step-epitope-prediction">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Step 04 — Epitope Prediction</h2>
        <p className="text-xs text-zinc-400">
          Filter and rank computer-modeled MHC-Class I/II & B-Cell binding epitopes to select optimal candidates for the mRNA construct.
        </p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-zinc-200">Interactive Bio-Filters:</span>
          </div>

          <div className="flex items-center gap-2.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Min Binding Score:</label>
            <input 
              type="range"
              min="50"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="h-1.5 rounded bg-zinc-800 accent-emerald-500 cursor-ew-resize w-20"
            />
            <span className="text-[10.5px] font-mono font-bold text-emerald-400 w-6">{minScore}+</span>
          </div>

          <button
            onClick={() => setExcludeHighRisk(!excludeHighRisk)}
            className={`text-[10.5px] font-semibold px-3 py-1.5 rounded-lg border transition ${
              excludeHighRisk 
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                : "bg-zinc-950 border-zinc-805 text-zinc-400 hover:text-white"
            }`}
          >
            {excludeHighRisk ? "▲ Filtering High-Escape Risk" : "Filter High-Escape Risk"}
          </button>
        </div>

        <div className="flex bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('all')}
            className={`rounded px-3 py-1 text-[10.5px] font-medium transition ${
              viewMode === 'all' ? "bg-emerald-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            All Predictions
          </button>
          <button
            onClick={() => setViewMode('included')}
            className={`rounded px-3 py-1 text-[10.5px] font-medium transition ${
              viewMode === 'included' ? "bg-emerald-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Selected Construct Only ({epitopes.filter(e => e.decision === 'Include').length})
          </button>
        </div>
      </div>

      {/* RIBBON/TRACK WINDOW VISUALISATIONS */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Structural Alignment tracks</span>
          <h3 className="text-xs font-bold text-zinc-200">Protein Spine Epitope Projection Mapped 1 to {proteinLength}</h3>
        </div>

        {/* Horizontal track grid representing the alignment axis */}
        <div className="relative border-b-2 border-zinc-800/80 pb-16 pt-3 font-mono">
          <div className="absolute bottom-12 left-0 right-0 flex justify-between text-[9px] text-zinc-650 tracking-wider">
            <span>RESIDUE - 1</span>
            <span>R - {Math.round(proteinLength * 0.25)}</span>
            <span>R - {Math.round(proteinLength * 0.5)}</span>
            <span>R - {Math.round(proteinLength * 0.75)}</span>
            <span>R - {proteinLength}</span>
          </div>

          {/* Spine ribbon representational line */}
          <div className="absolute bottom-10 left-0 right-0 h-2 bg-zinc-900 rounded-full border border-zinc-800"></div>

          {/* Vector rendering of epitopes boxes in custom positions over the timeline */}
          {filteredEpitopes.map((epi) => {
            const startPct = (epi.start / proteinLength) * 100;
            const endPct = (epi.end / proteinLength) * 100;
            const widthPct = Math.max(3, endPct - startPct);

            return (
              <div
                key={epi.id}
                className="absolute flex flex-col items-center group/epi"
                style={{ left: `${startPct}%`, width: `${widthPct}%`, bottom: "28px" }}
              >
                <div 
                  className={`h-4.5 rounded shadow-lg transition-all duration-300 w-full flex items-center justify-center cursor-pointer ${
                    epi.decision === "Include"
                      ? "bg-emerald-500 ring-2 ring-emerald-300 glow shadow-emerald-500/10"
                      : "bg-zinc-700/60 ring-1 ring-zinc-500/30 hover:bg-zinc-650"
                  }`}
                  onClick={() => onEpitopeToggle(epi.id)}
                  title={`${epi.id} (${epi.region}) (Click to Toggle)`}
                >
                  <span className="text-[8px] font-bold text-zinc-950">{epi.id.split('-')[2]}</span>
                </div>
                
                {/* Arrow stem indicator */}
                <div className={`h-2.5 w-0.5 mt-0.5 ${epi.decision === "Include" ? "bg-emerald-500" : "bg-zinc-700/60"}`}></div>

                {/* Micro hovering detail card */}
                <div className="absolute top-10 flex flex-col items-center opacity-0 group-hover/epi:opacity-100 bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg pointer-events-none transition duration-150 z-30 w-36 text-center">
                  <span className="text-[10px] font-bold text-white">{epi.id}</span>
                  <span className="text-[9px] text-zinc-400 font-mono">{epi.region} aa ({epi.surfaceExposure} SASA)</span>
                  <span className="text-[9.5px] text-emerald-400 font-extrabold mt-1 font-mono">Affinity: {epi.bindingScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EPITOPE CARDS LISTING & QUALITY HEATMAP */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Candidate List (Toggle directly in/out of vaccine mRNA template formulation) */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Candidate Rank Evaluation</h3>
            <span className="text-[10.5px] text-zinc-500 font-mono">Matches: {filteredEpitopes.length} predicted</span>
          </div>

          <div className="space-y-3">
            {filteredEpitopes.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-12 text-center text-zinc-500">
                <p className="text-sm">No epitopes match current filters.</p>
                <p className="text-xs mt-1 text-zinc-600">Reduce your minimum binding score slider or toggle escape risks.</p>
              </div>
            ) : (
              filteredEpitopes.map((epi) => (
                <div 
                  key={epi.id}
                  className={`rounded-xl border p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 ${
                    epi.decision === 'Include' 
                      ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-400/60" 
                      : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/60"
                  }`}
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {epi.id}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">Coordinates: <strong className="text-zinc-200">{epi.region}</strong></span>
                      <span className={`text-[9.5px] rounded px-1.5 py-0.5 font-bold uppercase tracking-wide font-mono ${
                        epi.escapeRisk === 'High' ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20" :
                        epi.escapeRisk === 'Medium' ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20" :
                        "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                      }`}>
                        Escape Risk: {epi.escapeRisk}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400">
                      <div>
                        <span>MHC-I Bind: </span>
                        <strong className="text-white">{epi.mhcIBinding}%</strong>
                      </div>
                      <div>
                        <span>MHC-II Bind: </span>
                        <strong className="text-white">{epi.mhcIIBinding}%</strong>
                      </div>
                      <div>
                        <span>SASA Exp: </span>
                        <strong className="text-emerald-400">{epi.surfaceExposure}</strong>
                      </div>
                      <div>
                        <span>Conserved: </span>
                        <strong className="text-zinc-200">{epi.conservation}%</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onEpitopeToggle(epi.id)}
                    className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-4 py-2 w-full sm:w-auto transition ${
                      epi.decision === 'Include'
                        ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-102"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-750 hover:text-white"
                    }`}
                  >
                    {epi.decision === 'Include' ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3px]" />
                        Selected
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Exclude
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic BI-AFFINITY HEATMAP / Right side visual */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Binding Affinity Heatmap</h3>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block border-b border-zinc-900 pb-2">
              Competitive Bio-Metric Heatmap matrix
            </span>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-0.5 text-[9px] font-bold font-mono text-zinc-500 pb-1 border-b border-zinc-900 leading-tight">
                <div className="col-span-3 text-left">EPITOPE</div>
                <div className="col-span-2 text-center h-full flex items-center justify-center">BIND</div>
                <div className="col-span-2 text-center h-full flex items-center justify-center">MHC-I</div>
                <div className="col-span-2 text-center h-full flex items-center justify-center">MHC-II</div>
                <div className="col-span-3 text-right">POP COVER</div>
              </div>

              {filteredEpitopes.map((epi) => {
                const getHeatColor = (score: number) => {
                  if (score >= 90) return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                  if (score >= 80) return "bg-emerald-600/10 text-emerald-400/90 border border-emerald-500/20";
                  if (score >= 70) return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                  return "bg-zinc-900 text-zinc-500 border border-zinc-800";
                };

                return (
                  <div key={epi.id} className="grid grid-cols-12 gap-0.5 text-[10px] font-mono items-center">
                    <div className="col-span-3 font-bold text-white truncate pr-1">{epi.id.substring(3)}</div>
                    
                    <div className={`col-span-2 h-7 rounded text-center font-bold flex items-center justify-center ${getHeatColor(epi.bindingScore)}`}>
                      {epi.bindingScore}
                    </div>
                    
                    <div className={`col-span-2 h-7 rounded text-center flex items-center justify-center ${getHeatColor(epi.mhcIBinding)}`}>
                      {epi.mhcIBinding}
                    </div>

                    <div className={`col-span-2 h-7 rounded text-center flex items-center justify-center ${getHeatColor(epi.mhcIIBinding)}`}>
                      {epi.mhcIIBinding}
                    </div>

                    <div className="col-span-3 font-bold text-zinc-300 text-right pr-1">
                      {epi.populationCoverage}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-amber-600/20 bg-amber-500/5 p-3 text-[10.5px] leading-relaxed text-amber-300/90">
              <div className="flex items-center gap-1.5 font-semibold text-amber-200 mb-1">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Efficacy Insight</span>
              </div>
              Epitopes binding both CD4+ T-Cells & CD8+ T-Cells provide the strongest dual activation pathways needed for molecular validation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
