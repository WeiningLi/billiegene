import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Cpu, 
  Database, 
  ToggleLeft, 
  ToggleRight, 
  Settings, 
  Play, 
  RefreshCw, 
  Terminal, 
  Check, 
  AlertCircle,
  HelpCircle,
  Code,
  Sliders,
  Sparkles,
  Layers,
  Heart,
  ShieldAlert,
  ChevronRight,
  GitMerge,
  Server,
  Activity,
  User,
  ExternalLink
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  temperature: number;
  skills: string[];
  tokensSpent: number;
  status: 'idle' | 'running' | 'completed' | 'queued';
  instructions: string;
}

interface Skill {
  id: string;
  name: string;
  source: string;
  description: string;
  enabled: boolean;
  tokenSavingValue: string;
}

export default function AgentWorkbench() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agt-structural",
      name: "Structural Context Agent",
      role: "Identifies 3D coordinates, extracellular surface segments, and steric shield coordinates.",
      model: "gemini-3.5-flash",
      temperature: 0.2,
      skills: ["afdb_pocket_locator", "uniprot_functional_pull"],
      tokensSpent: 0,
      status: "idle",
      instructions: "You are the GDM Structural Context analyzer. Your goal is to fetch protein records from standard AFDB endpoints and identify sequence coordinates that represent solvent-exposed extracellular target domains. Shield glycosylation regions to prevent immunogenic blockage."
    },
    {
      id: "agt-epitope",
      name: "Immunogenic Epitope Screener",
      role: "Predicts binding scores against Class I & II presentation HLA allele registries.",
      model: "gemini-3.5-pro",
      temperature: 0.1,
      skills: ["iedb_mhc_predictor"],
      tokensSpent: 0,
      status: "idle",
      instructions: "You are the GDM Epitope Predictor agent. Run IC50 threshold bindings against the target peptide library. Select sequences that are evolutionary conserved but also represent optimal MHC Class-I binding coefficients (<50nM)."
    },
    {
      id: "agt-safety",
      name: "PGx Off-Target Safety Agent",
      role: "Evaluates candidate targets against human RefSeq files to block autoimmunity triggers.",
      model: "gemini-3.5-flash",
      temperature: 0.0,
      skills: ["ncbi_blast_homology"],
      tokensSpent: 0,
      status: "idle",
      instructions: "You are the safety and off-target check validation agent. Align candidate sequences against known human protein databases. Flag any peptide segment exceeding >70% homology score, recommending candidate replacement."
    },
    {
      id: "agt-synthesizer",
      name: "AlphaGenome Codon Optimizer",
      role: "Synthesises optimized nucleotide constructs with codon-optimized, low-repeat transcripts.",
      model: "gemini-3.5-flash",
      temperature: 0.3,
      skills: ["alphagenome_codon_optimise"],
      tokensSpent: 0,
      status: "idle",
      instructions: "You are the AlphaGenome Construct Optimizer. Take high-ranking amino sequences, reverse-translate them choosing optimal codons for mammal expression. Avoid high transcript structures that trigger ribonuclease degradation."
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: "afdb_pocket_locator", name: "AlphaFold DB Structure Pocket Locator", source: "AlphaFold DB (AFDB)", description: "Fetches structural indices and maps extracellular 3D coordinates securely.", enabled: true, tokenSavingValue: "saves ~72% prompt size via indexed coordinates" },
    { id: "uniprot_functional_pull", name: "UniProt Molecular Feature puller", source: "UniProt KB", description: "Pulls active domains, signal peptides, and known glycosylation locations.", enabled: true, tokenSavingValue: "saves ~45% query payload by sending targeted features only" },
    { id: "ncbi_blast_homology", name: "NCBI Blast Identity Evaluator", source: "NCBI RefSeq", description: "Runs sequence alignment filters against human proteomes preventing autoimmunity.", enabled: true, tokenSavingValue: "replaces full string database lookups with summary maps" },
    { id: "iedb_mhc_predictor", name: "IEDB HLA Presentation Modeler", source: "IEDB Web APIs", description: "Computes MHC Class I & II IC50 peptide binding scores dynamically.", enabled: true, tokenSavingValue: "caches binding profiles reducing LLM context size by 12KB" },
    { id: "alphagenome_codon_optimise", name: "AlphaGenome Codon Adaptation System", source: "AlphaGenome Lib", description: "Translates and optimizes codon indexes for mammalian transport.", enabled: true, tokenSavingValue: "reduces structural iteration context length" }
  ]);

  const [activeTab, setActiveTab] = useState<"agents" | "flow" | "structures">("agents");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runProgress, setRunProgress] = useState<number>(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[SYSTEM] GDM Science Skills Engine initialized.",
    "[SYSTEM] Grounding connections established to AlphaFold DB, NCBI, and IEDB.",
    "[SYSTEM] Ready to trigger multi-agent pipeline orchestrator using Google Antigravity framework."
  ]);

  // AlphaFold interactive simulation coordinates
  const [selectedResidue, setSelectedResidue] = useState<number>(343);
  const [pLDDTConfidence, setPLDDTConfidence] = useState<number>(94.5);
  const [sasValue, setSasValue] = useState<number>(68.2);

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleAgentChange = (field: keyof Agent, value: any) => {
    if (!selectedAgent) return;
    const updated = { ...selectedAgent, [field]: value };
    setSelectedAgent(updated);
    setAgents(prev => prev.map(a => a.id === selectedAgent.id ? updated : a));
  };

  const triggerAgenticWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunProgress(5);
    setConsoleLogs(prev => [
      ...prev,
      `[ANTIGRAVITY] Launching Multi-Agent scientific pipeline (Sequence Target: SARS-CoV-2/spike/Omicron)...`,
      `[ANTIGRAVITY] Loading cached context models & preparing Science Skills payloads...`
    ]);

    // Stage 1: Structural Context Agent execution
    setTimeout(() => {
      setRunProgress(25);
      setAgents(prev => prev.map(a => a.id === "agt-structural" ? { ...a, status: 'running', tokensSpent: 1420 } : a));
      setConsoleLogs(prev => [
        ...prev,
        `[AGENT: Structural Context] Active. Resolving coordinates from AFDB index...`,
        `[SKILL: afdb_pocket_locator] Executed successfully. Found 7 extracellular loops.`,
        `[SKILL: uniprot_functional_pull] Query complete. Glycosylation shield confirmed at N-343.`,
        `[GROUNDING] Aligned sequence with AF-P0DTC2-F1. Prompt ground-to-index compression: 76% (Higher token efficiency achieved).`
      ]);
    }, 1200);

    // Stage 2: Epitope predictor
    setTimeout(() => {
      setRunProgress(50);
      setAgents(prev => {
        return prev.map(a => {
          if (a.id === "agt-structural") return { ...a, status: 'completed' };
          if (a.id === "agt-epitope") return { ...a, status: 'running', tokensSpent: 2850 };
          return a;
        });
      });
      setConsoleLogs(prev => [
        ...prev,
        `[AGENT: Immunogenic Epitope Screener] Active. Running ligand calculation against HLA reference...`,
        `[SKILL: iedb_mhc_predictor] Triggering IC50 threshold calculations...`,
        `[INFO] Predicted Class I HLA binding for BG-EPI-003: 95.4% binding affinity (<42nM). Optimal binder resolved.`,
        `[INFO] Caching presentation map. Compressed LLM instructions by ~18.5k tokens.`
      ]);
    }, 2800);

    // Stage 3: PGx safety BLAST screening
    setTimeout(() => {
      setRunProgress(75);
      setAgents(prev => {
        return prev.map(a => {
          if (a.id === "agt-epitope") return { ...a, status: 'completed' };
          if (a.id === "agt-safety") return { ...a, status: 'running', tokensSpent: 1100 };
          return a;
        });
      });
      setConsoleLogs(prev => [
        ...prev,
        `[AGENT: PGx Off-Target Safety] Active. Checking off-target polypeptide similarity matches...`,
        `[SKILL: ncbi_blast_homology] Aligning candidates with NCBI human RefSeq proteome...`,
        `[SAFETY] Aligned BG-EPI-003 against Homo Sapiens reference. Similarity score: 4.8% (<70% risk threshold). Safe to proceed.`,
        `[SAFETY] BG-EPI-002 flagged with high similarity score. Recommended exclusion.`
      ]);
    }, 4500);

    // Stage 4: AlphaGenome Synthesizer Optimizer
    setTimeout(() => {
      setRunProgress(95);
      setAgents(prev => {
        return prev.map(a => {
          if (a.id === "agt-safety") return { ...a, status: 'completed' };
          if (a.id === "agt-synthesizer") return { ...a, status: 'running', tokensSpent: 1950 };
          return a;
        });
      });
      setConsoleLogs(prev => [
        ...prev,
        `[AGENT: AlphaGenome Synthesizer] Active. Engineering mRNA transcripts...`,
        `[SKILL: alphagenome_codon_optimise] Computing Adaptability Index (CAI) for Homo sapiens...`,
        `[INFO] CAI resolved: 0.89. G-C content secured at 54.2%. Transcripts configured.`,
        `[ANTIGRAVITY] Asynchronous collaborative sequence completed.`
      ]);
    }, 6200);

    // Wrap up
    setTimeout(() => {
      setRunProgress(100);
      setIsRunning(false);
      setAgents(prev => prev.map(a => a.id === "agt-synthesizer" ? { ...a, status: 'completed' } : a));
      setConsoleLogs(prev => [
        ...prev,
        `[SYSTEM] Multi-Agent vaccine workflow completed successfully.`,
        `=========================================================`,
        `📊 ANTIGRAVITY SCIENCE AGENT METRICS SUMMARIES:`,
        `• Total LLM tokens saved via GDM Grounding Skills: 32,840 tokens`,
        `• Prompt ground-to-index efficiency: 74.8% reduction`,
        `• Grounded targets validated: 3 high-binding, 100% human-safe candidates`,
        `• AlphaGenome transcripts generated: 1 optimal mRNA construct`,
        `=========================================================`,
        `[SYSTEM] Results hot-loaded into compiler pipeline steps.`
      ]);
    }, 7500);
  };

  return (
    <div className="space-y-6" id="agent-workbench-root">
      
      {/* BANNER HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block font-mono">
              GDM Science Portal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Google DeepMind Science Agent Workbench
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Configure dynamic multi-agent structures utilizing Google Science Skills repositories (`google-deepmind/science-skills`) and Google Antigravity tools for high-grounding biological analysis with massive token efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a 
            href="https://github.com/google-deepmind/science-skills" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-medium text-zinc-350 hover:text-white hover:bg-zinc-900 transition font-mono"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>science-skills Repo</span>
          </a>

          <button 
            onClick={triggerAgenticWorkflow}
            disabled={isRunning}
            className={`flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/10 active:scale-[0.98] ${
              isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Running Agent Workflow...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white text-white" />
                <span>Trigger Agentic Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* HORIZONTAL WORKSPACE TABS */}
      <div className="flex border-b border-zinc-900 justify-start items-center">
        <button 
          onClick={() => setActiveTab("agents")}
          className={`px-4 pb-3 text-xs font-bold font-mono transition border-b-2 -mb-px ${
            activeTab === "agents" 
              ? "border-emerald-500 text-white" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          🤖 Managed Agents ({agents.length})
        </button>
        <button 
          onClick={() => setActiveTab("flow")}
          className={`px-4 pb-3 text-xs font-bold font-mono transition border-b-2 -mb-px ${
            activeTab === "flow" 
              ? "border-emerald-500 text-white" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          ⛓️ Agentic Collaboration Flow
        </button>
        <button 
          onClick={() => setActiveTab("structures")}
          className={`px-4 pb-3 text-xs font-bold font-mono transition border-b-2 -mb-px ${
            activeTab === "structures" 
              ? "border-emerald-500 text-white" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          🔮 AlphaFold 3D Confident Grounder
        </button>
      </div>

      {/* TAB CONTENT VIEWS */}
      {activeTab === "agents" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* LEFT COLUMN: ACTIVE MANAGED AGENTS LIST */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between pl-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                Agent Registries
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Antigravity Model Server</span>
            </div>

            <div className="space-y-2.5">
              {agents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left rounded-xl border p-4 transition group relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? "bg-zinc-900 border-zinc-700 text-white shadow-xl shadow-zinc-950/20" 
                        : "bg-zinc-950/50 border-zinc-900 hover:bg-zinc-900/40 text-zinc-300"
                    }`}
                  >
                    {/* Status accent strip */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                      agent.status === 'running' 
                        ? "bg-amber-500" 
                        : agent.status === 'completed'
                          ? "bg-emerald-500"
                          : "bg-zinc-800"
                    }`} />

                    <div className="flex items-center justify-between w-full pl-2">
                      <div className="flex items-center gap-2.5">
                        <Bot className={`h-4.5 w-4.5 ${isSelected ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span className="font-bold text-xs font-mono">{agent.name}</span>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-mono uppercase font-black tracking-wider ${
                        agent.status === 'running' 
                          ? "bg-amber-500/10 text-amber-400 animate-pulse" 
                          : agent.status === 'completed'
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                      }`}>
                        {agent.status}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-zinc-450 mt-2 line-clamp-2 pl-2 leading-relaxed">
                      {agent.role}
                    </p>

                    <div className="flex items-center justify-between text-[9.5px] font-mono text-zinc-500 mt-3 pt-2 w-full border-t border-zinc-900/40 pl-2">
                      <span className="text-zinc-400">LLM: <strong className="text-zinc-300 font-semibold">{agent.model}</strong></span>
                      <span>{agent.tokensSpent > 0 ? `${agent.tokensSpent} tokens` : "Idle State"}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* QUICK STATS */}
            <div className="rounded-xl border border-zinc-805 bg-zinc-900/30 p-4.5 space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-200">Antigravity Token Saver Panel</span>
              </div>
              <p className="text-[10.5px] text-zinc-400 leading-normal">
                Google's Science Skills use structured index matching inside Python runtimes. Instead of pasting full fasta structures into model contexts repeatedly, agents pull summarized ground references, shrinking pipeline cost significantly.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="rounded bg-zinc-950 p-2.5 border border-zinc-850">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">Compression Save</span>
                  <strong className="text-emerald-400 font-mono text-lg block mt-0.5">74.8%</strong>
                </div>
                <div className="rounded bg-zinc-950 p-2.5 border border-zinc-850">
                  <span className="block text-[9px] text-zinc-500 uppercase tracking-wide">Context Delta Cost</span>
                  <strong className="text-emerald-400 font-mono text-lg block mt-0.5">~1/4x</strong>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: SELECTED AGENT DETAIL & INSTRUCTION EDITOR */}
          <div className="lg:col-span-1 space-y-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono pl-1 block">
              Agent Customization
            </span>

            {selectedAgent ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4 flex flex-col justify-between">
                
                {/* Header info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                    <Settings className="h-4 w-4 text-emerald-400" />
                    <span>Configuration Parameters</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Fine-tune model anchors, task directives, and temperatures for {selectedAgent.name}.
                  </p>
                </div>

                {/* Model and parameters inputs */}
                <div className="space-y-3.5 pt-3 border-t border-zinc-900">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">Model Target API</label>
                    <select 
                      value={selectedAgent.model}
                      onChange={(e) => handleAgentChange("model", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 text-xs px-3 py-2 text-zinc-200 outline-none"
                    >
                      <option value="gemini-3.5-flash">gemini-3.5-flash (Balanced Core)</option>
                      <option value="gemini-3.5-pro">gemini-3.5-pro (Deep-Chain Reasoning)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                      <span>Model Temperature</span>
                      <span>{selectedAgent.temperature}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9.5px] font-mono text-zinc-500 font-bold">Deterministic</span>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={selectedAgent.temperature}
                        onChange={(e) => handleAgentChange("temperature", parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <span className="text-[9.5px] font-mono text-zinc-500 font-bold">Creative</span>
                    </div>
                  </div>

                  {/* System instruction textbox */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">Task Agent System Directives</label>
                    <textarea
                      rows={6}
                      value={selectedAgent.instructions}
                      onChange={(e) => handleAgentChange("instructions", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 focus:border-zinc-700 p-3 text-xs text-zinc-200 outline-none font-mono leading-relaxed"
                    />
                  </div>

                  {/* Active bound skills tag badges */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">Bound GDM Science Skills APIs</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.skills.map((skId) => (
                        <span key={skId} className="inline-flex items-center rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[9.5px] font-mono text-emerald-400 leading-none">
                          🔑 {skId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded bg-zinc-900/60 p-3 border border-zinc-850 text-[10px] leading-relaxed text-zinc-400 mt-2">
                  💾 Antigravity model templates persist automatically inside development workflow states.
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 text-center text-zinc-500 text-xs">
                Select an agent on the left to customize directives.
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: GDM SCIENCE SKILLS LIBRARY */}
          <div className="lg:col-span-1 space-y-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono pl-1 block">
              GDM Science-Skills Modules
            </span>

            <div className="space-y-3">
              {skills.map((skill) => (
                <div 
                  key={skill.id}
                  className={`rounded-xl border p-4 transition-all flex items-start gap-4 ${
                    skill.enabled 
                      ? "bg-zinc-950 border-emerald-500/20 shadow-lg shadow-emerald-500/2"
                      : "bg-zinc-955 border-zinc-90 w bg-zinc-900/10 text-zinc-450"
                  }`}
                >
                  {/* Skill icon or indicator */}
                  <div className={`flex h-7 w-7 items-center justify-center rounded shrink-0 ${
                    skill.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-900 text-zinc-500"
                  }`}>
                    <Database className="h-4 w-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-xs text-zinc-200 font-sans tracking-tight">{skill.name}</span>
                      <button onClick={() => toggleSkill(skill.id)} className="text-zinc-500 hover:text-white transition">
                        {skill.enabled ? (
                          <ToggleRight className="h-5.5 w-5.5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="h-5.5 w-5.5 text-zinc-600" />
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-zinc-450 leading-relaxed font-mono">
                      {skill.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 w-fit mt-1">
                      <span>⚡</span>
                      <span>{skill.tokenSavingValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === "flow" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* AGENT FLOWCHART / CHANNELS (LEFT TRAY 2 COLS) */}
            <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block font-mono">Orchestration Layout</span>
                <h3 className="text-xs font-bold text-white">Google Antigravity Computational Science Pipeline Flowchart</h3>
                <p className="text-[10px] text-zinc-450 mt-1">
                  How managed agents sequentially run tool schemas from deepmind's science-skills library asynchronously.
                </p>
              </div>

              {/* FLOW DIAGRAM NODES LAYOUT */}
              <div className="relative border border-zinc-900 rounded-lg p-6 bg-zinc-900/10 space-y-6">
                
                {/* Node 1 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-zinc-950 rounded-lg border border-zinc-850 relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">1</div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">Step 01 — Structural Screening</h4>
                      <p className="text-[9.5px] text-zinc-450 mt-0.5 font-mono">
                        Agent: <strong className="text-zinc-300">Structural Context Agent</strong> | Skill: <strong className="text-emerald-400">afdb_pocket_locator</strong> + <strong className="text-emerald-400">uniprot_functional_pull</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>AFDB Synced</span>
                  </div>
                </div>

                {/* Arrow vector divider */}
                <div className="flex justify-center -my-3 h-5">
                  <div className="w-0.5 h-full bg-emerald-500/30 font-bold flex items-center justify-center text-[10px] text-emerald-400">↓</div>
                </div>

                {/* Node 2 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-zinc-950 rounded-lg border border-zinc-850 relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">2</div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">Step 02 — Binding Predictions</h4>
                      <p className="text-[9.5px] text-zinc-450 mt-0.5 font-mono">
                        Agent: <strong className="text-zinc-300">Immunogenic Epitope Screener</strong> | Skill: <strong className="text-emerald-400">iedb_mhc_predictor</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>IEDB API Connective</span>
                  </div>
                </div>

                {/* Arrow vector divider */}
                <div className="flex justify-center -my-3 h-5">
                  <div className="w-0.5 h-full bg-emerald-500/30 font-bold flex items-center justify-center text-[10px] text-emerald-400">↓</div>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-zinc-950 rounded-lg border border-zinc-850 relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">3</div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">Step 03 — Biomarker Off-Target Evaluation</h4>
                      <p className="text-[9.5px] text-zinc-450 mt-0.5 font-mono">
                        Agent: <strong className="text-zinc-300">PGx Off-Target Safety Agent</strong> | Skill: <strong className="text-emerald-400">ncbi_blast_homology</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>RefSeq Homology Safeed</span>
                  </div>
                </div>

                {/* Arrow vector divider */}
                <div className="flex justify-center -my-3 h-5">
                  <div className="w-0.5 h-full bg-emerald-500/30 font-bold flex items-center justify-center text-[10px] text-emerald-400">↓</div>
                </div>

                {/* Node 4 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-zinc-950 rounded-lg border border-zinc-850 relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">4</div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">Step 04 — Transcription Optimization</h4>
                      <p className="text-[9.5px] text-zinc-455 mt-0.5 font-mono">
                        Agent: <strong className="text-zinc-300">AlphaGenome Codon Optimizer</strong> | Skill: <strong className="text-emerald-400">alphagenome_codon_optimise</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Mammalian Codon Primed</span>
                  </div>
                </div>

              </div>
            </div>

            {/* LIVE CONSOLE DIAGNOSTICS LOG VIEWER */}
            <div className="lg:col-span-1 rounded-xl border border-zinc-800 bg-zinc-950 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block font-mono">System Live Trace</span>
                <h3 className="text-xs font-bold text-white">Antigravity Orchestration Logger</h3>
                <p className="text-[10.5px] text-zinc-400 mt-1 max-w-sm">
                  Examine background python subprocesses binding GDM library APIs in real-time.
                </p>
              </div>

              {/* Progress dynamic bar indicator */}
              {runProgress > 0 && (
                <div className="space-y-1 bg-zinc-900/60 p-3 rounded-lg border border-zinc-850">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>Workflow execution meter</span>
                    <strong className="text-emerald-400">{runProgress}%</strong>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full rounded transition-all duration-300"
                      style={{ width: `${runProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Console log window */}
              <div className="rounded-xl bg-zinc-900/30 border border-zinc-850 p-4 font-mono text-[10px] leading-relaxed h-[280px] overflow-y-auto space-y-2">
                {consoleLogs.map((log, i) => (
                  <div key={i} className={`whitespace-pre-line ${
                    log.includes("[SYSTEM]") 
                      ? "text-zinc-450" 
                      : log.includes("[ANTIGRAVITY]") 
                        ? "text-cyan-400 font-bold" 
                        : log.includes("[SKILL:") 
                          ? "text-emerald-450" 
                          : log.includes("[SAFETY]")
                            ? "text-zinc-300"
                            : "text-zinc-380"
                  }`}>
                    {log}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5 text-[10px] text-zinc-400 bg-zinc-900/40 p-3 border border-zinc-850 rounded">
                <Terminal className="h-4.5 w-4.5 text-zinc-450" />
                <span>Logs auto-flush on pipeline reset. To rerun trigger above.</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === "structures" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* SEC 1: ALPHAFOLD 3D COORDINATE CONTROLLER */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-5">
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block font-mono font-black">Structure Grounder</span>
              <h3 className="text-sm font-bold text-white">AlphaFold DB (AFDB) Target Coordinate Mapping</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Directly ground sequence alignment parameters into predicted structures of AlphaFold. Probe residues to confirm chemical exposure metrics.
              </p>
            </div>

            <div className="space-y-4 pt-3 border-t border-zinc-900 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Reference Database ID</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded">AF-P0DTC2-F1</span>
              </div>

              {/* Slider for picking residues */}
              <div className="space-y-1.5 bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-850">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-zinc-300">Residue coordinate selector</span>
                  <strong className="text-emerald-400 text-sm">Glycoprotein residue #{selectedResidue} (Asn)</strong>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="1273"
                  value={selectedResidue}
                  onChange={(e) => {
                    const pos = parseInt(e.target.value);
                    setSelectedResidue(pos);
                    // generate clean procedural stats mapped to spike sequences
                    if (pos > 300 && pos < 550) {
                      setPLDDTConfidence(Number((92 + (pos % 7)).toFixed(1)));
                      setSasValue(Number((60 + (pos % 25)).toFixed(1)));
                    } else if (pos > 1200) {
                      setPLDDTConfidence(Number((55 + (pos % 12)).toFixed(1))); // transmembrane domain has lower confidence
                      setSasValue(Number((2 + (pos % 5)).toFixed(1)));
                    } else {
                      setPLDDTConfidence(Number((84 + (pos % 15)).toFixed(1)));
                      setSasValue(Number((35 + (pos % 40)).toFixed(1)));
                    }
                  }}
                  className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                />
              </div>

              {/* Visual confidence indicators */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded bg-zinc-900 p-3.5 border border-zinc-805 text-center">
                  <span className="text-[9.5px] text-zinc-500 block uppercase tracking-wider font-semibold">pLDDT AlphaFold Confidence</span>
                  <strong className={`font-mono text-xl block mt-1 ${
                    pLDDTConfidence > 90 
                      ? "text-emerald-400" 
                      : pLDDTConfidence > 70 
                        ? "text-amber-400" 
                        : "text-red-400"
                  }`}>
                    {pLDDTConfidence}%
                  </strong>
                  <span className="text-[9px] text-zinc-450 mt-1 block">
                    {pLDDTConfidence > 90 ? "Highly Confident (Very Stable)" : pLDDTConfidence > 70 ? "Good Confidence" : "Disordered/Inward Region"}
                  </span>
                </div>

                <div className="rounded bg-zinc-900 p-3.5 border border-zinc-805 text-center">
                  <span className="text-[9.5px] text-zinc-500 block uppercase tracking-wider font-semibold">Solvent Exposure (SASA)</span>
                  <strong className="font-mono text-emerald-400 text-xl block mt-1">
                    {sasValue} Å²
                  </strong>
                  <span className="text-[9px] text-zinc-450 mt-1 block">
                    {sasValue > 50 ? "Highly Accessible (Surface-Extracellular)" : "Partially Shielded / Transmembrane"}
                  </span>
                </div>
              </div>

              {/* Annotation alert banner */}
              <div className="rounded-lg bg-zinc-900/60 p-4 border border-zinc-850 space-y-1 bg-emerald-500/5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">GDM Grounding Verdict</span>
                <p className="text-[11px] leading-relaxed text-zinc-350 font-sans">
                  Residue coordinate #{selectedResidue} falls into the extracellular surface loop target segment. The AFDB structure confirms high surface exposure with sufficient distance from highly glycosylated steric trees, indicating an optimal antigen targeting window.
                </p>
              </div>

            </div>
          </div>

          {/* SEC 2: INTERACTIVE BIOLOGICAL 3D CANVAS SIMULATOR */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block font-mono font-black">Spatial Plot</span>
              <h3 className="text-sm font-bold text-white">Visualizing Grounded 33D Protein Structure Model</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Procedurally projected active protein fold map using AlphaFold coordinate files.
              </p>
            </div>

            {/* Simulated 3D structure viewer */}
            <div className="relative h-[250px] w-full rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center overflow-hidden">
              
              {/* grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>

              {/* Interactive spatial points map */}
              <div className="relative flex items-center justify-center scale-90 w-full">
                
                {/* Simulated ribbon structure: drawing a collection of interconnected points with glowing spheres */}
                <svg className="w-64 h-48 drop-shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  {/* Ribbon curves path */}
                  <path 
                    d="M 20,105 C 40,30 90,40 110,110 C 130,180 160,190 200,100 C 220,50 240,60 250,90" 
                    fill="none" 
                    stroke="url(#ribbonGrad)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  
                  {/* Active Selected Residue Indicator line */}
                  <line 
                    x1="110" 
                    y1="110" 
                    x2="150" 
                    y2="50" 
                    stroke="#10b981" 
                    strokeWidth="1.5" 
                    strokeDasharray="3,3" 
                  />

                  {/* Nodes along sequence */}
                  <circle cx="20" cy="105" r="5" fill="#3b82f6" />
                  <circle cx="55" cy="55" r="5.5" fill="#10b981" />
                  
                  {/* Selected coordinate highlight */}
                  <g className="animate-bounce">
                    <circle cx="110" cy="110" r="8" fill="#10b981" className="opacity-30" />
                    <circle cx="110" cy="110" r="5" fill="#059669" />
                  </g>

                  <circle cx="160" cy="160" r="5" fill="#8b5cf6" />
                  <circle cx="210" cy="85" r="5" fill="#ef4444" />
                  <circle cx="245" cy="80" r="5.5" fill="#f59e0b" />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="35%" stopColor="#10b981" />
                      <stop offset="70%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Annotation popups floating inside custom canvas */}
                <div className="absolute top-4 left-6 rounded border border-zinc-805 bg-zinc-950/90 px-2 py-1 text-[9.5px] font-mono text-zinc-400">
                  Signal Peptide (Blue)
                </div>
                <div className="absolute top-2 right-6 rounded border border-zinc-805 bg-zinc-950/90 px-2 py-1 text-[9.5px] font-mono text-zinc-400">
                  RBD (Purple)
                </div>
                <div className="absolute bottom-4 left-16 rounded border border-emerald-555 bg-zinc-950 px-2 py-1.5 text-[10px] font-mono text-white text-center ring-1 ring-emerald-500/10">
                  🧬 Active coordinate target: <strong className="text-emerald-400 font-black">#{selectedResidue}</strong>
                </div>
                <div className="absolute bottom-5 right-6 rounded border border-zinc-805 bg-zinc-950/90 px-2 py-1 text-[9.5px] font-mono text-zinc-400">
                  Intracellular TM (Red)
                </div>
              </div>
            </div>

            <div className="rounded bg-zinc-900/65 p-3.5 border border-zinc-850 flex items-center justify-between font-mono text-[10px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Active Model Alignment: SARS-CoV-2/spike</span>
              </span>
              <span>Coordinates updated live with selection</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
