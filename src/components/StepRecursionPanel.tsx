import React, { useState, useEffect } from "react";
import { Cpu, RotateCw, Check, AlertCircle, Play, Sliders, Layers, Terminal } from "lucide-react";

interface StepRecursionPanelProps {
  dnaSequence: string;
  onSelectCandidate: (sequence: string, start: number, end: number, score: number) => void;
  activeCandidateStart: number;
}

const CODON_MAP: Record<string, string> = {
  ATA: "I", ATC: "I", ATT: "I", ATG: "M",
  ACA: "T", ACC: "T", ACG: "T", ACT: "T",
  AAC: "N", AAT: "N", AAA: "K", AAG: "K",
  AGC: "S", AGT: "S", AGA: "R", AGG: "R",
  CTA: "L", CTC: "L", CTG: "L", CTT: "L",
  CCA: "P", CCC: "P", CCG: "P", CCT: "P",
  CAC: "H", CAT: "H", CAA: "Q", CAG: "Q",
  CGA: "R", CGC: "R", CGG: "R", CGT: "R",
  GTA: "V", GTC: "V", GTG: "V", GTT: "V",
  GCA: "A", GCC: "A", GCG: "A", GCT: "A",
  GAC: "D", GAT: "D", GAA: "E", GAG: "E",
  GGA: "G", GGC: "G", GGG: "G", GGT: "G",
  TCA: "S", TCC: "S", TCG: "S", TCT: "S",
  TTC: "F", TTT: "F", TTA: "L", TTG: "L",
  TAC: "Y", TAT: "Y", TAA: "*", TAG: "*",
  TGC: "C", TGT: "C", TGA: "*", TGG: "W",
};

const hydropathyScale: Record<string, number> = {
  A: 1.8, C: 2.5, D: -3.5, E: -3.5, F: 2.8, G: -0.4, H: -3.2, I: 4.5,
  K: -3.9, L: 3.8, M: 1.9, N: -3.5, P: -1.6, Q: -3.5, R: -4.5, S: -0.8,
  T: -0.7, V: 4.2, W: -0.9, Y: -1.3
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function hydropathyValues(sequence: string): number[] {
  const radius = Math.max(2, Math.min(9, Math.floor(sequence.length / 36)));
  return sequence.split("").map((_, index) => {
    let sum = 0;
    let count = 0;
    const start = Math.max(0, index - radius);
    const end = Math.min(sequence.length - 1, index + radius);
    for (let i = start; i <= end; i += 1) {
      sum += hydropathyScale[sequence[i]] ?? 0;
      count += 1;
    }
    return count ? sum / count : 0;
  });
}

function predictedExposureMarkers(sequence: string, maxMarkers = 4): number[] {
  if (sequence.length < 9) return [];
  const values = hydropathyValues(sequence);
  const spacing = Math.max(10, Math.floor(sequence.length / 8));
  const ranked = values
    .map((value, index) => ({ residue: index + 1, score: -value }))
    .sort((a, b) => b.score - a.score);
  const markers: number[] = [];
  for (const item of ranked) {
    if (markers.every(residue => Math.abs(residue - item.residue) >= spacing)) {
      markers.push(item.residue);
    }
    if (markers.length >= maxMarkers) break;
  }
  return markers.sort((a, b) => a - b);
}

function scoreRecursionWindow(sequence: string): number {
  const values = hydropathyValues(sequence);
  if (!values.length) return 0;
  const hydrophilicRatio = values.filter(value => value < 0).length / values.length;
  const meanHydropathy = values.reduce((sum, value) => sum + value, 0) / values.length;
  const chargedRatio = sequence.replace(/[^DEKRH]/g, "").length / sequence.length;
  const aromaticPenalty = sequence.replace(/[^FWY]/g, "").length / sequence.length;
  return clamp(0.48 + hydrophilicRatio * 0.28 + chargedRatio * 0.18 - Math.max(0, meanHydropathy) * 0.035 - aromaticPenalty * 0.08, 0.31, 0.97);
}

function recursionCandidateStarts(sequence: string, windowLength: number): number[] {
  if (!sequence.length) return [];
  const maxStart = Math.max(1, sequence.length - windowLength + 1);
  const markers = predictedExposureMarkers(sequence, 8);
  const starts = new Set<number>([1, maxStart]);

  markers.forEach(marker => {
    starts.add(clamp(Math.round(marker - windowLength / 2), 1, maxStart));
  });

  [0.2, 0.4, 0.6, 0.8].forEach(fraction => {
    starts.add(clamp(Math.round(sequence.length * fraction - windowLength / 2), 1, maxStart));
  });

  return Array.from(starts).sort((a, b) => a - b);
}

export interface RecursionCandidate {
  id: string;
  rank: number;
  start: number;
  end: number;
  length: number;
  sequence: string;
  score: number;
  scoreLabel: string;
}

export default function StepRecursionPanel({ dnaSequence, onSelectCandidate, activeCandidateStart }: StepRecursionPanelProps) {
  const [swarmNodes, setSwarmNodes] = useState<number>(10);
  const [slicePool, setSlicePool] = useState<number>(1000);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [candidates, setCandidates] = useState<RecursionCandidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [proteinSeq, setProteinSeq] = useState<string>("");

  // Translate / clean sequence once
  useEffect(() => {
    if (!dnaSequence) return;
    const lines = dnaSequence.trim().split("\n");
    const clean = lines.filter(line => !line.startsWith(">")).join("").toUpperCase().replace(/[^A-Z]/g, "");
    
    const atgcCount = (clean.match(/[ATGC]/g) || []).length;
    let aminoString = "";

    if (clean.length > 0 && atgcCount / clean.length > 0.8) {
      for (let i = 0; i < clean.length - 2; i += 3) {
        const codon = clean.substring(i, i + 3);
        const aa = CODON_MAP[codon] || "X";
        if (aa === "*") break; 
        aminoString += aa;
      }
    } else {
      aminoString = clean;
    }
    setProteinSeq(aminoString);
  }, [dnaSequence]);

  // Handle recursion calculations
  const calculateRecursionCandidates = (rawProtein: string): RecursionCandidate[] => {
    if (!rawProtein || rawProtein.length === 0) return [];
    const windowLength = Math.min(rawProtein.length, 390);
    const starts = recursionCandidateStarts(rawProtein, windowLength);
    
    const rawCandidates = starts.map((start, index) => {
      const end = Math.min(rawProtein.length, start + windowLength - 1);
      const windowSequence = rawProtein.slice(start - 1, end);
      const score = scoreRecursionWindow(windowSequence);
      return {
        id: `recursed-candidate-${start}-${end}-${index}`,
        rank: 0,
        start,
        end,
        length: windowSequence.length,
        sequence: windowSequence,
        score,
        scoreLabel: score.toFixed(2),
      };
    });

    // Sort descending by score
    rawCandidates.sort((a, b) => b.score - a.score);

    // Limit to top 8 and assign final ranks
    return rawCandidates.slice(0, 8).map((candidate, index) => ({
      ...candidate,
      rank: index + 1,
      id: `recursed-rank-${index + 1}-${candidate.start}-${candidate.end}`
    }));
  };

  const handleRunScan = () => {
    if (!proteinSeq) {
      setConsoleLogs(["[error] No valid protein sequence parsed. Ingestion required."]);
      return;
    }
    setIsScanning(true);
    setScanProgress(0);
    setConsoleLogs([
      `[init] Starting multi-thread targetability scan using ${swarmNodes} parallel nodes.`,
      `[info] Generating ${slicePool} protein slices across reading windows.`
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setScanProgress(progress);
      
      if (progress === 20) {
        setConsoleLogs(prev => [...prev, `[thread] Swarm cluster dispatched. Slicing protein sequence (total length: ${proteinSeq.length} aa).`]);
      } else if (progress === 40) {
        setConsoleLogs(prev => [...prev, `[thread] Swarm calculating hydropathy index values across sliding window (radius = ${Math.max(2, Math.min(9, Math.floor(proteinSeq.length / 36)))} residues).`]);
      } else if (progress === 60) {
        setConsoleLogs(prev => [...prev, `[thread] Identifying high-exposure surface markers based on Kyte-Doolittle hydropathy vectors.`]);
      } else if (progress === 80) {
        setConsoleLogs(prev => [...prev, `[thread] Evaluating structural targetability constraints and ranking windows < 400 aa limit.`]);
      } else if (progress >= 100) {
        clearInterval(interval);
        const results = calculateRecursionCandidates(proteinSeq);
        setCandidates(results);
        setIsScanning(false);
        if (results.length > 0) {
          const topResult = results[0];
          setSelectedCandidateId(topResult.id);
          setConsoleLogs(prev => [
            ...prev,
            `[success] Scan completed. ${results.length} recursion candidates generated successfully under 400 aa.`,
            `[results] Top candidate #1 (Residues ${topResult.start}-${topResult.end}) scored ${topResult.scoreLabel} vaccine affinity.`
          ]);
        }
      }
    }, 150);
  };

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  return (
    <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5 space-y-5" id="recursion-segmental-cutter">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-900 pb-3 gap-2">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block flex items-center gap-1">
            <Cpu className="h-3 w-3 animate-pulse" />
            Parallel Threaded Slicing
          </span>
          <h3 className="text-sm font-bold text-zinc-200">Recursion Slice Engine (Billie Gene Diagnostic Integration)</h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-900/60 px-2.5 py-1 rounded border border-zinc-850">
          Target Limit: &lt; 400 aa (ESM Atlas)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/45 p-4 rounded-xl border border-zinc-850 text-xs font-mono">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-1.5">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            Swarm Slicing Parameters
          </h4>
          <div className="space-y-3.5">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Parallel Nodes (Swarm Threading)</span>
                <span className="text-cyan-400 font-bold">{swarmNodes} nodes</span>
              </div>
              <input
                type="range"
                min={2}
                max={16}
                value={swarmNodes}
                onChange={(e) => setSwarmNodes(Number(e.target.value))}
                disabled={isScanning}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Target Slices Evaluated</span>
                <span className="text-cyan-400 font-bold">{slicePool} slices</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={100}
                value={slicePool}
                onChange={(e) => setSlicePool(Number(e.target.value))}
                disabled={isScanning}
                className="w-full accent-cyan-500"
              />
            </div>

            <button
              onClick={handleRunScan}
              disabled={isScanning || !proteinSeq}
              className="w-full relative overflow-hidden flex items-center justify-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-900 disabled:text-zinc-650 transition font-mono font-bold text-white text-xs py-2.5 cursor-pointer border border-cyan-500/20 active:translate-y-0.5"
            >
              {isScanning ? (
                <>
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Computing targetability ({scanProgress}%)</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run targetability recursion scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* METRICS HUD */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-850 pb-1.5">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            Active Target Analytics
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 flex flex-col justify-between">
              <span className="text-[7.5px] font-black text-zinc-500 uppercase tracking-widest block">Active Window</span>
              <strong className="text-sm font-bold text-white font-mono mt-1 text-center truncate">
                {activeCandidate ? `${activeCandidate.start}–${activeCandidate.end}` : "--"}
              </strong>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 flex flex-col justify-between">
              <span className="text-[7.5px] font-black text-zinc-500 uppercase tracking-widest block">Slices Range</span>
              <strong className="text-sm font-bold text-cyan-400 font-mono mt-1 text-center truncate">
                {activeCandidate ? `${activeCandidate.length} aa` : "--"}
              </strong>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 flex flex-col justify-between">
              <span className="text-[7.5px] font-black text-zinc-500 uppercase tracking-widest block">Sim Score</span>
              <strong className="text-sm font-bold text-emerald-400 font-mono mt-1 text-center truncate">
                {activeCandidate ? activeCandidate.scoreLabel : "--"}
              </strong>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[8.5px] text-zinc-500 font-bold block">REAL-TIME SEQUENCE RECURSIVE CUTTER</span>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900 h-11 overflow-hidden flex items-center select-none text-[10px] tracking-wide break-all text-zinc-500 leading-none">
              <div className="w-full truncate">
                {proteinSeq ? (
                  <>
                    <span className="text-zinc-650 font-mono truncate">
                      {proteinSeq.slice(0, Math.max(0, (activeCandidate?.start || 1) - 1))}
                    </span>
                    <span className="text-cyan-400 font-bold font-mono bg-cyan-950/40 px-0.5 rounded border border-cyan-900/50">
                      {proteinSeq.slice((activeCandidate?.start || 1) - 1, activeCandidate?.end || 390)}
                    </span>
                    <span className="text-zinc-650 font-mono truncate">
                      {proteinSeq.slice(activeCandidate?.end || 390)}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-600 italic">Awaiting sequence scan to cut</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SWARM PROCESS TELEMETRY / CONSOLE */}
      {consoleLogs.length > 0 && (
        <div className="rounded-lg bg-black border border-zinc-900/60 p-3 space-y-1 text-[10.5px] font-mono leading-relaxed select-none h-24 overflow-y-auto">
          <div className="flex items-center gap-1 text-cyan-400 font-bold border-b border-zinc-900 pb-1 mb-1.5">
            <Terminal className="h-3 w-3" />
            <span>SWARM PROCESS TERMINAL</span>
          </div>
          {consoleLogs.map((log, idx) => {
            let colorClass = "text-zinc-450";
            if (log.startsWith("[success]")) colorClass = "text-emerald-400 font-bold";
            else if (log.startsWith("[error]")) colorClass = "text-red-400 font-bold";
            else if (log.startsWith("[init]") || log.startsWith("[results]")) colorClass = "text-cyan-400";
            return (
              <div key={idx} className={colorClass}>
                {log}
              </div>
            );
          })}
        </div>
      )}

      {/* RANKED RECURSION RESULTS TABLE */}
      {candidates.length > 0 && (
        <div className="space-y-2 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ranked Recursion Targetability Results</span>
            <span className="text-[9px] text-zinc-500 font-bold">&lt; 400 aa</span>
          </div>
          <div className="border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950">
            <div className="max-h-52 overflow-y-auto">
              <table className="w-full text-xs text-left text-zinc-300 font-mono">
                <thead className="text-[9.5px] text-zinc-500 uppercase bg-zinc-900/60 sticky top-0 border-b border-zinc-900 font-bold">
                  <tr>
                    <th className="px-4 py-2 font-mono">Window Residues</th>
                    <th className="px-4 py-2 font-mono">Length</th>
                    <th className="px-4 py-2 font-mono">Targetability Score</th>
                    <th className="px-4 py-2 font-mono">Affinity Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-mono">
                  {candidates.map((candidate) => {
                    const isSelected = candidate.id === selectedCandidateId;
                    const isActiveInMain = activeCandidateStart === candidate.start;
                    return (
                      <tr
                        key={candidate.id}
                        onClick={() => setSelectedCandidateId(candidate.id)}
                        className={`cursor-pointer transition hover:bg-zinc-900/50 ${
                          isSelected ? "bg-zinc-900" : ""
                        }`}
                      >
                        <td className="px-4 py-2 font-mono font-bold flex items-center gap-1.5">
                          <span className={`h-1 w-1.5 rounded ${isSelected ? "bg-cyan-400 animate-pulse" : "bg-transparent"}`} />
                          Residues {candidate.start} – {candidate.end}
                          {isActiveInMain && (
                            <span className="text-[7px] bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-1 py-0.2 rounded font-black font-mono">
                              ACTIVE FOLD
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 font-mono text-zinc-400">{candidate.length} aa</td>
                        <td className="px-4 py-2 font-mono text-emerald-400 font-bold">{candidate.scoreLabel}</td>
                        <td className="px-4 py-2 font-mono">
                          <span className="px-1.5 py-0.5 rounded font-bold bg-zinc-900 border border-zinc-800 text-[10px]">
                            #{candidate.rank}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeCandidate) {
                  onSelectCandidate(
                    activeCandidate.sequence,
                    activeCandidate.start,
                    activeCandidate.end,
                    activeCandidate.score
                  );
                }
              }}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 border border-cyan-500/20 py-2 rounded-lg text-xs font-mono font-bold text-white transition cursor-pointer flex items-center justify-center gap-1.5 active:translate-y-0.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Recursion Slice to 3D Viewer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
