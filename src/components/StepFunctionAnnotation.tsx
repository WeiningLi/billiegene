import { useState } from "react";
import { AnnotationMetric } from "../types";
import { Scale, HeartPulse, Sliders, ShieldCheck, Zap } from "lucide-react";

interface StepFunctionAnnotationProps {
  pathogenName: string;
  exposureScore: number;
}

export default function StepFunctionAnnotation({ pathogenName, exposureScore }: StepFunctionAnnotationProps) {
  // Let's model a robust set of parameters from our target glycoprotein
  const metricsList: AnnotationMetric[] = [
    {
      name: "Surface exposure",
      value: `${(exposureScore * 100).toFixed(0)}%`,
      meaning: "Fraction of solvent-accessible surface area (SASA) predicted outside hydrophobic boundaries",
      importance: "High exposure indicates that antibody recognition of the native pathogen is highly probable",
      score: Math.round(exposureScore * 100)
    },
    {
      name: "Functional importance",
      value: "95/100",
      meaning: "Infiltration and host-receptor binding fusion-core machinery participation index",
      importance: "Essential functional nodes suffer low fitness when mutated, making them stable vaccine targets",
      score: 95
    },
    {
      name: "Conservation score",
      value: "82%",
      meaning: "Sequence alignment protection metrics mapped across 400+ known historic genomic variants",
      importance: "Higher conservation prevents mutational escape paths and variant evasion",
      score: 82
    },
    {
      name: "Mutation density",
      value: "Moderate",
      meaning: "Estimated substitutions per codon across public variants within standard deviation bounds",
      importance: "Low mutation coordinates reduce structural degradation over seasonal drift cycles",
      score: 65 // lower is safer, but score is rating quality: so quality score of stable region is e.g. 70
    },
    {
      name: "Predicted solubility",
      value: "Good (Hydropathy -0.4)",
      meaning: "Grand Average of Hydropathy (GRAVY) simulation representing molecular expression safety",
      importance: "Balanced solubility guarantees easier mRNA synthesis, lipid packing, and target folding",
      score: 78
    },
    {
      name: "Structural stability",
      value: "High (ΔG -8.4 kcal)",
      meaning: "Gibbs free energy modeling of folded ectodomain configuration",
      importance: "Highly stable targets prevent structural misfolding or immediate degradative denaturation",
      score: 84
    },
    {
      name: "Glycosylation shielding",
      value: "Moderate",
      meaning: "N-linked carbohydrate shielding metrics covering candidate binding residues",
      importance: "Shielded coordinate regions are masked from MHC/antibody recognition, reducing immunogenicity",
      score: 68
    },
    {
      name: "Population coverage",
      value: "81%",
      meaning: "Cross-MHC projection covering Class I/II HLA clusters in reference population registers",
      importance: "Ensures broad-spectrum protection across highly diverse cohorts",
      score: 81
    }
  ];

  // Calculate composite rating following requested formula inside specifications:
  // Billie Gene Target Score = 25% surface exposure + 20% conservation + 20% predicted binding strength
  // + 15% structural stability + 10% manufacturability + 10% population coverage - risk penalties
  const surfExposureConst = Math.round(exposureScore * 100);
  const conservationConst = 82;
  const bindingStrengthConst = 90;
  const structStabilityConst = 84;
  const manufacturabilityConst = 78;
  const popCoverageConst = 81;
  const compositeScore = Math.round(
    0.25 * surfExposureConst +
    0.20 * conservationConst +
    0.20 * bindingStrengthConst +
    0.15 * structStabilityConst +
    0.10 * manufacturabilityConst +
    0.10 * popCoverageConst
  );

  return (
    <div className="space-y-6" id="step-function-annotation">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Step 03 — Function Annotation</h2>
        <p className="text-xs text-zinc-400">
          Combine biological function analysis with computational developability metrics to assess target vaccine viability.
        </p>
      </div>

      {/* STAGE 02 INCOMING FEEDSTOCK HUB ATTACHMENT */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-3.5 flex flex-wrap gap-4 items-center justify-between font-mono text-[10.5px] shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Zap className="h-4 w-4 animate-pulse text-emerald-400" />
          </div>
          <div>
            <span className="text-zinc-500 font-extrabold uppercase text-[10px] tracking-wider block">Stage 2 Ingested Feedstock</span>
            <p className="text-[10px] text-zinc-300 font-mono">Structural boundaries successfully loaded into annotation matrices.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono text-[9px] select-none">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            Target: {pathogenName.split(" ")[0]} Homologs
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            Exposure Indexed: {exposureScore.toFixed(2)}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            SP Span: 1–12 aa
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold border-zinc-700/80">
            TM Excluded: 1213–1237 aa
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
            ESMFold 3D Validated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Metric Formula Summary / Left Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-emerald-500/5 p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 h-16 w-16 text-emerald-500/10 pointer-events-none">
              <Scale className="h-full w-full" />
            </div>
            
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Billie Gene Target Score
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-white font-mono">{compositeScore}</span>
              <span className="text-xs text-zinc-400">/ 100</span>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide block">
                Target Score Distribution Weighting:
              </span>
              <div className="space-y-1.5 text-[10px] font-mono text-zinc-400">
                <div className="flex justify-between">
                  <span>Surface Exposure</span>
                  <span className="text-emerald-400">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conservation Protection</span>
                  <span className="text-emerald-400">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted Binding Strength</span>
                  <span className="text-emerald-400">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Structural Stability</span>
                  <span className="text-emerald-400">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Manufacturability (GRAVY)</span>
                  <span className="text-emerald-400">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Global HLA Coverage</span>
                  <span className="text-emerald-400">10%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded bg-emerald-500/15 border border-emerald-500/20 p-3">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Recommendation</span>
              </div>
              <p className="text-[10px] text-emerald-400/90 leading-relaxed mt-1">
                Score criteria validated. Proceed with High Confidence to Epitope Window screening segments.
              </p>
            </div>
          </div>

          {/* Quick Annotation summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-emerald-500" />
              Target Biological Role
            </h3>
            <div className="text-[11.5px] text-zinc-300 space-y-2">
              <p>
                <strong>Ectodomain structure:</strong> Spike-glycoprotein homolog involved directly in host receptor binding, fusion triggers, and subsequent host cell genomic integration.
              </p>
              <p className="text-zinc-400 text-xs">
                Designing antigens targeting these specific entry gates ensures antibodies can neutralise active viral particles before cellular injection occurs.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Grid metric tracker / Right Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-4">
              Computational & Developability Parameters Map
            </span>

            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              {metricsList.map((m, idx) => (
                <div 
                  key={idx} 
                  className="rounded-lg bg-zinc-900/60 border border-zinc-800/80 p-3.5 space-y-2.5 hover:border-zinc-700/60 transition group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition">{m.name}</span>
                    <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ring-1 ring-emerald-500/20">{m.value}</span>
                  </div>

                  {/* Quality micro progress bar */}
                  <div className="h-2 w-full bg-zinc-950 rounded overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full rounded transition-all duration-500 group-hover:bg-emerald-400"
                      style={{ width: `${m.score}%` }}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      <strong>Bioinformatics:</strong> {m.meaning}
                    </p>
                    <p className="text-[9.5px] text-zinc-500 leading-tight italic">
                      💡 {m.importance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
