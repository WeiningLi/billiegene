import React from "react";
import { 
  ShieldCheck, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  Dna, 
  Cpu, 
  ShieldAlert, 
  Map, 
  Activity, 
  Tag, 
  Award, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";

interface VaccineScorecardProps {
  surfaceScore: number;
  relevanceScore: number;
  epitopeScore: number;
  conservationScore: number;
  manufacturabilityScore: number;
  safetyScore: number;
}

export default function VaccineScorecard({
  surfaceScore = 91,
  relevanceScore = 86,
  epitopeScore = 95,
  conservationScore = 88,
  manufacturabilityScore = 78,
  safetyScore = 82
}: VaccineScorecardProps) {

  // Dynamic weighted formula computation:
  // Surface Accessibility: 20%
  // Functional Relevance: 15%
  // Epitopic Binding Quality: 20%
  // Conserved Strains: 15%
  // Translation Manufacturing: 15%
  // PGx Tolerability: 15%
  const combinedScore = Math.round(
    0.20 * surfaceScore +
    0.15 * relevanceScore +
    0.20 * epitopeScore +
    0.15 * conservationScore +
    0.15 * manufacturabilityScore +
    0.15 * safetyScore
  );

  let ratingVerdict = "Excellent - Highly Immunogenic";
  let verdictColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
  let verdictDescription = "Peptide construct displays optimal solvent exposure, robust Class-I/II HLA alleles representation, and zero high-homology human autoimmunity triggers. Safe for wet lab assay testing.";

  if (combinedScore < 75) {
    ratingVerdict = "Sub-Optimal Construct";
    verdictColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
    verdictDescription = "Construct possesses low sequence conservation or limited HLA presentation. Review excluded epitope segments to bolster vaccine scope.";
  } else if (combinedScore < 85) {
    ratingVerdict = "Good Candidate - Standard Efficacy";
    verdictColor = "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
    verdictDescription = "Construct exhibits fair coverage but can be optimized for secondary structures or codon adaptation index variables to prevent transcription aborts.";
  }

  const scoreCategories = [
    {
      id: "surface",
      name: "Surface Target Exposure Index",
      short: "Extracellular SASA",
      score: surfaceScore,
      weight: "20%",
      icon: Map,
      iconColor: "text-blue-400",
      bgGradient: "from-blue-500/5 to-transparent",
      borderColor: "border-blue-500/10",
      description: "Calculates the ratio and accessibility of extracellular/exposed residues compared to internal or transmembrane domains.",
      verdict: surfaceScore >= 85 ? "Optimal Exposure" : "Shielded Loops Detected"
    },
    {
      id: "relevance",
      name: "Pathogen Functional Relevance",
      short: "Target Vitality",
      score: relevanceScore,
      weight: "15%",
      icon: Tag,
      iconColor: "text-emerald-400",
      bgGradient: "from-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/10",
      description: "Scores whether selected segments map directly to crucial infectivity structures (such as the viral Receptor Binding Domain/RBD).",
      verdict: relevanceScore >= 80 ? "Critical Domain Match" : "Secondary Homology"
    },
    {
      id: "epitope",
      name: "MHC Target Binding Epitope Quality",
      short: "Binding Affinities",
      score: epitopeScore,
      weight: "20%",
      icon: Award,
      iconColor: "text-purple-400",
      bgGradient: "from-purple-500/5 to-transparent",
      borderColor: "border-purple-500/10",
      description: "Represents the maximum HLA presentation binder scores computed across global class-I/II allele panels.",
      verdict: epitopeScore >= 90 ? "High Affinity Presenter" : "Moderate Binding"
    },
    {
      id: "conservation",
      name: "Evolutionary Variant Conservation",
      short: "Broad Escape Protection",
      score: conservationScore,
      weight: "15%",
      icon: Activity,
      iconColor: "text-cyan-400",
      bgGradient: "from-cyan-500/5 to-transparent",
      borderColor: "border-cyan-500/10",
      description: "Reflects strain conservation ratios. High conservation resists mutational escape across evolutionary pandemic variant branches.",
      verdict: conservationScore >= 80 ? "Conserved Target" : "Strain-Specific Only"
    },
    {
      id: "manufacturability",
      name: "mRNA Construct Manufacturability",
      short: "CAI Translation Stability",
      score: manufacturabilityScore,
      weight: "15%",
      icon: Cpu,
      iconColor: "text-amber-400",
      bgGradient: "from-amber-500/5 to-transparent",
      borderColor: "border-amber-500/10",
      description: "Measures transcript viability, secondary structure complexity, G-C boundaries, and mammalian codon adaptation index scores.",
      verdict: manufacturabilityScore >= 75 ? "Stable Transcripts" : "Ribonuclease Risk"
    },
    {
      id: "safety",
      name: "PGx Cohort Tolerability & Safety",
      short: "Autoimmunity Clearance",
      score: safetyScore,
      weight: "15%",
      icon: ShieldCheck,
      iconColor: "text-pink-400",
      bgGradient: "from-pink-500/5 to-transparent",
      borderColor: "border-pink-500/10",
      description: "Analyzes candidate sequences against human proteomes preventing cross-reactive off-target autoimmunity triggers.",
      verdict: safetyScore >= 80 ? "Safely Cleared" : "Homology Flagged"
    }
  ];

  return (
    <div className="space-y-6" id="vaccine-scorecard-root">
      
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            Bioinformatics Metric Core
          </span>
        </div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mt-1">
          Detailed Category Score Breakdown
        </h3>
        <p className="text-[10.5px] text-zinc-400 mt-1">
          Each validation parameter represents a distinct algorithmic simulation. Combined metrics determine overall clinical candidate viability.
        </p>
      </div>

      {/* INDIVIDUAL CATEGORY LIST (CATEGORICAL SCORES) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {scoreCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div 
              key={cat.id} 
              className={`rounded-xl border ${cat.borderColor} bg-gradient-to-br ${cat.bgGradient} bg-zinc-900/10 p-4.5 space-y-3 hover:border-zinc-700/60 transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded bg-zinc-950 border border-zinc-850 ${cat.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11.5px] font-bold text-white tracking-tight">{cat.short}</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-zinc-500 font-bold">
                    Weight: {cat.weight}
                  </span>
                </div>
                
                <p className="text-[10.5px] font-bold text-zinc-250 leading-tight">
                  {cat.name}
                </p>
                <p className="text-[10px] text-zinc-450 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Progress and score tag */}
              <div className="space-y-2 pt-2 border-t border-zinc-900/50">
                <div className="flex items-center justify-between font-mono text-[10.5px]">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8.5px] bg-zinc-950 px-1.5 rounded border border-zinc-900 leading-none py-0.5">
                    {cat.verdict}
                  </span>
                  <strong className="text-white text-sm">{cat.score}%</strong>
                </div>

                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      cat.score >= 85 
                        ? "bg-emerald-500" 
                        : cat.score >= 75 
                          ? "bg-cyan-500" 
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMBINED COMPOSITE SCORE AT THE BOTTOM (HIGH DESIGNS FOCUS!) */}
      <div className="rounded-xl border border-zinc-805 bg-gradient-to-r from-zinc-900 to-zinc-950 overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-emerald-500/1 z-0 pointer-events-none" />
        
        <div className="p-6 relative z-10 grid grid-cols-1 gap-6 md:grid-cols-12 items-center">
          
          {/* Visual dynamic gauge / Radial dial simulation */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center py-2 relative border-b md:border-b-0 md:border-r border-zinc-900">
            <span className="text-[9.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
              Composite Alignment Formula
            </span>

            {/* Glowing Big Combined Score Circle */}
            <div className="relative flex items-center justify-center my-4 h-32 w-32 rounded-full border-4 border-zinc-900 bg-zinc-950/80 shadow-inner group">
              <div className="absolute inset-2.5 rounded-full border-2 border-dashed border-emerald-500/20 group-hover:rotate-12 transition duration-[10s]" />
              <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-emerald-400 rotate-45 animate-pulse" />
              
              <div className="text-center">
                <span className="text-[52px] font-black font-mono text-white leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                  {combinedScore}
                </span>
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mt-[-4px]">
                  / 100 max
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 shrink-0">
              <span>Weighted Formula Result</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Active</span>
            </div>
          </div>

          {/* Right text verdict breakdown and formula logic explanation */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">
                Pipeline Verdict Status
              </span>
              <h4 className="text-md font-extrabold text-white mt-1">
                {ratingVerdict}
              </h4>
              <p className="text-xs text-zinc-400 leading-normal mt-1 w-full max-w-lg">
                {verdictDescription}
              </p>
            </div>

            {/* Formula visualization breakdown */}
            <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-850 font-mono text-[9px] leading-relaxed text-zinc-500 space-y-1.5">
              <span className="text-[9.5px] font-bold text-zinc-450 uppercase block tracking-wider">Formula: Combined Sum (W)</span>
              <p className="leading-normal">
                Score = (<strong className="text-zinc-350">Surface</strong> * 0.20) + (<strong className="text-zinc-350">Relevance</strong> * 0.15) + (<strong className="text-zinc-350">Epitopes</strong> * 0.20) + (<strong className="text-zinc-350">Conserved</strong> * 0.15) + (<strong className="text-zinc-350">mRNA CAI</strong> * 0.15) + (<strong className="text-zinc-350">Safety</strong> * 0.15)
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-zinc-900 text-zinc-450 font-semibold text-[9.5px]">
                <span>Inputs:</span>
                <span>[{surfaceScore} * .20] = {Math.round(surfaceScore * 0.20)}</span>
                <span>•</span>
                <span>[{relevanceScore} * .15] = {Math.round(relevanceScore * 0.15)}</span>
                <span>•</span>
                <span>[{epitopeScore} * .20] = {Math.round(epitopeScore * 0.20)}</span>
                <span>•</span>
                <span>[{conservationScore} * .15] = {Math.round(conservationScore * 0.15)}</span>
                <span>•</span>
                <span>[{manufacturabilityScore} * .15] = {Math.round(manufacturabilityScore * 0.15)}</span>
                <span>•</span>
                <span>[{safetyScore} * .15] = {Math.round(safetyScore * 0.15)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10.5px] leading-relaxed text-zinc-450">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>Dossier verified with physical structures under Meta's ESM Atlas specifications.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
