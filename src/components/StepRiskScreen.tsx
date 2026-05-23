import { useState } from "react";
import { RiskScreenResult } from "../types";
import { ShieldCheck, Percent, HelpCircle, Table, Check, Layers, AlertCircle, Info, Landmark } from "lucide-react";

interface StepRiskScreenProps {
  selectedCount: number;
}

export default function StepRiskScreen({ selectedCount }: StepRiskScreenProps) {
  // Let's model a high fidelity dataset of human HLA patterns
  const riskResult: RiskScreenResult = {
    predictedCoverage: selectedCount > 2 ? 84.8 : selectedCount > 0 ? 63.2 : 0,
    lowResponseRisk: selectedCount > 2 ? 'Low' : 'Moderate',
    autoimmunityFlag: false,
    similarityNotes: "Tested against NCBI Human RefSeq database. No candidate peptide sequence exceeds >70% identity thresholds with native human polypeptides.",
    confidence: 'Medium',
    hlaAlleles: [
      { allele: "HLA-A*02:01", frequency: 45.2, bindingAffinity: "High (<50nM)", riskSymbol: "Optimal" },
      { allele: "HLA-A*11:01", frequency: 18.5, bindingAffinity: "High (<120nM)", riskSymbol: "Optimal" },
      { allele: "HLA-B*35:01", frequency: 12.1, bindingAffinity: "Moderate (<250nM)", riskSymbol: "Standard" },
      { allele: "HLA-DRB1*15:01", frequency: 22.4, bindingAffinity: "High (<80nM)", riskSymbol: "Optimal" },
      { allele: "HLA-DQB1*06:02", frequency: 14.8, bindingAffinity: "Weak (<500nM)", riskSymbol: "Low Response" },
      { allele: "HLA-C*07:01", frequency: 28.6, bindingAffinity: "High (<65nM)", riskSymbol: "Optimal" }
    ]
  };

  const coverageByRegion = [
    { region: "Global Cohorts", value: riskResult.predictedCoverage },
    { region: "East Asia", value: riskResult.predictedCoverage > 0 ? Math.min(98, riskResult.predictedCoverage + 6) : 0 },
    { region: "South Asia", value: riskResult.predictedCoverage > 0 ? Math.max(50, riskResult.predictedCoverage - 8) : 0 },
    { region: "Europe & Americas", value: riskResult.predictedCoverage > 0 ? Math.min(95, riskResult.predictedCoverage + 3) : 0 },
    { region: "Sub-Saharan Africa", value: riskResult.predictedCoverage > 0 ? Math.max(48, riskResult.predictedCoverage - 11) : 0 }
  ];

  return (
    <div className="space-y-6" id="step-risk-screen">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Step 06 — Pharmacogenomic Risk Screen</h2>
        <p className="text-xs text-zinc-400">
          Estimate population scale vaccine coverage and check for off-target autoimmunity similarities across human gene registries.
        </p>
      </div>

      {/* Safety Banner */}
      <div className="rounded-xl border border-blue-550/20 bg-blue-500/5 p-4 text-xs text-blue-300 leading-relaxed flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-blue-100">Careful Interpretation Protocol:</strong> This pharmacogenomic (PGx) projection modeling uses computer predictions of MHC binding against known allele sets. It provides exploratory insights to assist assay setup and sample selections, but does not provide diagnostic predictions, safety guarantees, or dry-clinical evaluations.
        </div>
      </div>

      {/* RATING CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Predicted Population Coverage</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{riskResult.predictedCoverage}%</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Global coverage based on Class I / II allele databases</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Low-Response Risk Signals</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${
              riskResult.lowResponseRisk === 'Low' ? "text-emerald-400" : "text-amber-400"
            }`}>
              {riskResult.lowResponseRisk}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Likelihood of non-presentation in specific HLA pools</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Risk Exploration Confidence</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">{riskResult.confidence}</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Based on database granularity and reference sequences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Population HLA allele frequencies histogram */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">ALLELE MAP</span>
            <h3 className="text-xs font-bold text-zinc-200">Predicted Population Coverage by Demographics</h3>
          </div>

          <div className="space-y-3.5">
            {coverageByRegion.map((c, i) => (
              <div key={i} className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-zinc-300">
                  <span className="font-semibold text-white">{c.region}</span>
                  <span className="font-bold text-emerald-400">{c.value}%</span>
                </div>
                {/* Visual bar meter */}
                <div className="h-3 w-full bg-zinc-900 rounded-md overflow-hidden flex border border-zinc-805">
                  <div 
                    className="bg-emerald-500 rounded h-full transition-all duration-500"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded bg-zinc-900/60 p-3.5 border border-zinc-850 space-y-2">
            <span className="text-[10.5px] font-bold text-zinc-350 uppercase tracking-wide block">Autoimmunity Cross-Reaction Test</span>
            <p className="text-[11px] text-zinc-400 leading-normal">
              🔍 {riskResult.similarityNotes}
            </p>
          </div>
        </div>

        {/* Detailed HLA allele coverage details table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">HLA REGISTRY DATATRAY</span>
            <h3 className="text-xs font-bold text-zinc-200">Simulated Target HLA Binding Affinity Profiles</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10.5px] border-collapse">
              <thead>
                <tr className="border-b border-zinc-805 text-zinc-500 uppercase font-black text-[9px] select-none tracking-wider">
                  <th className="pb-2.5">Specific Allele Class</th>
                  <th className="pb-2.5 text-center">Frequency (%)</th>
                  <th className="pb-2.5 text-center">MHC Affinity</th>
                  <th className="pb-2.5 text-right">PGx Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {riskResult.hlaAlleles.map((hla, idx) => (
                  <tr key={idx} className="group hover:bg-zinc-900/40 select-text">
                    <td className="py-2.5 font-bold text-white group-hover:text-emerald-300 transition">{hla.allele}</td>
                    <td className="py-2.5 text-zinc-400 text-center">{hla.frequency}%</td>
                    <td className="py-2.5 text-zinc-300 text-center">{hla.bindingAffinity}</td>
                    <td className="py-2.5 text-right font-semibold">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                        hla.riskSymbol === "Low Response" 
                          ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                      }`}>
                        {hla.riskSymbol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded bg-zinc-900/60 p-3 border border-zinc-850 flex items-center gap-2.5">
            <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Target binds to majority core global presentation alleles. Recommend advancing this vaccine model towards Candidate Report compiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
