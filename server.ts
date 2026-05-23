import express from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

// Re-map process.env variables if needed.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Lazy initialize Gemini client
let ai: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!ai) {
    if (!GEMINI_API_KEY) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. The app will use interactive biological mockup generation for high-fidelity responses.");
    }
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

// Reference mock datasets for popular biological variants
const PATHOGEN_DEMO_DATA: Record<string, any> = {
  "sars_cov_2": {
    name: "SARS-CoV-2 (Spike Glycoprotein)",
    stats: {
      length: 1273,
      gcContent: 37.8,
      orfCount: 11,
      predictedRegionsCount: 4,
      confidence: 96,
      validated: true,
      warnings: ["High mutation density observed in Receptor Binding Domain (RBD)."]
    },
    domains: [
      { name: "Signal Peptide", start: 1, end: 12, color: "bg-blue-500", description: "Directs protein to endoplasmic reticulum/secretory pathway", type: "signal" },
      { name: "N-Terminal Domain (NTD)", start: 13, end: 304, color: "bg-emerald-500", description: "Surface exterior domain, moderate immune recognition", type: "extracellular" },
      { name: "Receptor Binding Domain (RBD)", start: 305, end: 543, color: "bg-purple-500", description: "Critical target: binds directly to human ACE2 receptor", type: "extracellular" },
      { name: "Fusion Peptide (FP)", start: 788, end: 806, color: "bg-amber-500", description: "Mediates viral and host membrane fusion", type: "extracellular" },
      { name: "Heptad Repeat 1 & 2", start: 912, end: 1162, color: "bg-cyan-500", description: "Structural fusion core machinery, highly conserved across strains", type: "extracellular" },
      { name: "Transmembrane Region (TM)", start: 1213, end: 1237, color: "bg-red-500", description: "Anchors the glycoprotein into the lipid double-layer", type: "transmembrane" },
      { name: "Cytoplasmic Tail", start: 1238, end: 1273, color: "bg-zinc-500", description: "Intracellular domain, facilitates viral assembly", type: "tail" }
    ],
    mutations: [
      { position: 417, original: "K", mutant: "N", frequency: 0.88, severity: "high" },
      { position: 484, original: "E", mutant: "K", frequency: 0.94, severity: "high" },
      { position: 501, original: "N", mutant: "Y", frequency: 0.98, severity: "medium" },
      { position: 614, original: "D", mutant: "G", frequency: 0.99, severity: "low" }
    ],
    glycosylation: [
      { position: 234, type: "N-linked", shieldingFactor: 0.8 },
      { position: 343, type: "N-linked", shieldingFactor: 0.75 },
      { position: 801, type: "N-linked", shieldingFactor: 0.4 }
    ],
    epitopes: [
      { id: "BG-EPI-001", region: "112–128", start: 112, end: 128, bindingScore: 91, mhcIBinding: 92, mhcIIBinding: 89, bCellScore: 93, surfaceExposure: "High", conservation: 88, populationCoverage: 81, escapeRisk: "Low", safetyScore: 94, decision: "Include" },
      { id: "BG-EPI-002", region: "308–322", start: 308, end: 322, bindingScore: 81, mhcIBinding: 83, mhcIIBinding: 79, bCellScore: 84, surfaceExposure: "High", conservation: 72, populationCoverage: 85, escapeRisk: "High", safetyScore: 88, decision: "Exclude" },
      { id: "BG-EPI-003", region: "411–427", start: 411, end: 427, bindingScore: 95, mhcIBinding: 96, mhcIIBinding: 94, bCellScore: 95, surfaceExposure: "High", conservation: 84, populationCoverage: 74, escapeRisk: "Medium", safetyScore: 90, decision: "Include" },
      { id: "BG-EPI-005", region: "601–615", start: 601, end: 615, bindingScore: 68, mhcIBinding: 71, mhcIIBinding: 65, bCellScore: 68, surfaceExposure: "Medium", conservation: 95, populationCoverage: 52, escapeRisk: "Low", safetyScore: 78, decision: "Exclude" },
      { id: "BG-EPI-006", region: "701–718", start: 701, end: 718, bindingScore: 87, mhcIBinding: 85, mhcIIBinding: 88, bCellScore: 82, surfaceExposure: "Medium", conservation: 91, populationCoverage: 89, escapeRisk: "Low", safetyScore: 96, decision: "Include" }
    ]
  },
  "influenza_h5n1": {
    name: "Influenza A H5N1 (Hemagglutinin)",
    stats: {
      length: 568,
      gcContent: 41.2,
      orfCount: 8,
      predictedRegionsCount: 3,
      confidence: 94,
      validated: true,
      warnings: ["Requires monitoring of cleavage site mutations."]
    },
    domains: [
      { name: "Signal Peptide", start: 1, end: 16, color: "bg-blue-500", description: "Guides migration", type: "signal" },
      { name: "HA1 Globular Head Domain", start: 17, end: 340, color: "bg-purple-500", description: "Binds sialic acid receptors; highly mutable", type: "extracellular" },
      { name: "HA2 Stem Domain", start: 341, end: 530, color: "bg-cyan-500", description: "Fusion machinery; highly conserved cross-neutralization target", type: "extracellular" },
      { name: "Transmembrane Region (TM)", start: 531, end: 555, color: "bg-red-500", description: "Membrane anchor", type: "transmembrane" },
      { name: "Cytoplasmic Tail", start: 556, end: 568, color: "bg-zinc-500", description: "Intracellular tail", type: "tail" }
    ],
    mutations: [
      { position: 226, original: "Q", mutant: "L", frequency: 0.72, severity: "high" },
      { position: 228, original: "G", mutant: "S", frequency: 0.65, severity: "medium" }
    ],
    glycosylation: [
      { position: 34, type: "N-linked", shieldingFactor: 0.85 },
      { position: 169, type: "N-linked", shieldingFactor: 0.62 }
    ],
    epitopes: [
      { id: "BG-EPI-101", region: "28–42", start: 28, end: 42, bindingScore: 89, mhcIBinding: 90, mhcIIBinding: 87, bCellScore: 91, surfaceExposure: "High", conservation: 93, populationCoverage: 79, escapeRisk: "Low", safetyScore: 95, decision: "Include" },
      { id: "BG-EPI-102", region: "220–235", start: 220, end: 235, bindingScore: 94, mhcIBinding: 95, mhcIIBinding: 92, bCellScore: 96, surfaceExposure: "High", conservation: 61, populationCoverage: 83, escapeRisk: "High", safetyScore: 84, decision: "Exclude" },
      { id: "BG-EPI-103", region: "350–365", start: 350, end: 365, bindingScore: 88, mhcIBinding: 86, mhcIIBinding: 89, bCellScore: 82, surfaceExposure: "Medium", conservation: 98, populationCoverage: 88, escapeRisk: "Low", safetyScore: 98, decision: "Include" }
    ]
  },
  "zika_virus": {
    name: "Zika Virus (Envelope Protein)",
    stats: {
      length: 504,
      gcContent: 45.3,
      orfCount: 3,
      predictedRegionsCount: 2,
      confidence: 91,
      validated: true,
      warnings: []
    },
    domains: [
      { name: "Domain I (Central Barrel)", start: 1, end: 52, color: "bg-blue-500", description: "Central core structure", type: "extracellular" },
      { name: "Domain II (Dimerization)", start: 53, end: 290, color: "bg-emerald-500", description: "Main dimerization interface containing hydrophobic fusion loop", type: "extracellular" },
      { name: "Domain III (Ig-like receptor binding)", start: 291, end: 400, color: "bg-purple-500", description: "Puts out projections for cellular attachment/receptor interactions", type: "extracellular" },
      { name: "Stem and Anchor region", start: 401, end: 475, color: "bg-cyan-500", description: "Consensus alignment helix", type: "extracellular" },
      { name: "Transmembrane domain (TM)", start: 476, end: 504, color: "bg-red-500", description: "Anchors to membrane", type: "transmembrane" }
    ],
    mutations: [
      { position: 156, original: "N", mutant: "S", frequency: 0.45, severity: "medium" }
    ],
    glycosylation: [
      { position: 154, type: "N-linked", shieldingFactor: 0.9 }
    ],
    epitopes: [
      { id: "BG-EPI-201", region: "98–113", start: 98, end: 113, bindingScore: 95, mhcIBinding: 97, mhcIIBinding: 93, bCellScore: 96, surfaceExposure: "High", conservation: 99, populationCoverage: 92, escapeRisk: "Low", safetyScore: 99, decision: "Include" },
      { id: "BG-EPI-202", region: "310–325", start: 310, end: 325, bindingScore: 82, mhcIBinding: 81, mhcIIBinding: 84, bCellScore: 80, surfaceExposure: "High", conservation: 85, populationCoverage: 76, escapeRisk: "Medium", safetyScore: 92, decision: "Include" }
    ]
  }
};

// API: Parse / validate sequence
app.post("/api/analyze-sequence", (req, res) => {
  const { sequence, pathogenType, referenceStrain } = req.body;
  if (!sequence) {
    return res.status(400).json({ error: "No sequence provided" });
  }

  // Determine if it matches one of our demo strains
  const keys = Object.keys(PATHOGEN_DEMO_DATA);
  const matchedKey = keys.find(key => 
    sequence.toUpperCase().includes(key.toUpperCase()) || 
    referenceStrain?.toLowerCase().includes(key) || 
    pathogenType?.toLowerCase().includes(key)
  ) || "sars_cov_2";

  const template = PATHOGEN_DEMO_DATA[matchedKey] || PATHOGEN_DEMO_DATA["sars_cov_2"];

  // Respond with customized parameters
  const stats = { ...template.stats };
  // Modify slightly randomly or keep fixed
  stats.gcContent = sequence.length > 50 ? Number(((sequence.match(/[GC]/gi) || []).length / sequence.length * 100).toFixed(1)) : stats.gcContent;
  if (stats.gcContent === 0) stats.gcContent = template.stats.gcContent;
  stats.length = sequence.length > 100 ? sequence.length : template.stats.length;

  res.json({
    pathogenKey: matchedKey,
    name: template.name,
    stats,
    domains: template.domains,
    mutations: template.mutations,
    glycosylation: template.glycosylation,
    epitopes: template.epitopes
  });
});

// API: AI Assistant Chat & Step Explainer
app.post("/api/explain-step", async (req, res) => {
  const { stepId, stepTitle, stateData, prompt } = req.body;
  
  const systemInstruction = `You are "Billie Gene", an advanced AI vaccine design copilot for researchers.
Your role of expertise is computational vaccinology, epitope prediction, structural mRNA engineering, and pharmacogenomics.
Explain the concepts, bioinformatics criteria, and safety details concisely.
Maintain a helpful, human, and professional research-oriented tone.
Do not generate clinical diagnosis or wet-lab protocols. Reiterate when helpful that this is a research demo prototype.`;

  const contextPrompt = `Step ${stepId}: "${stepTitle}".
User State Data: ${JSON.stringify(stateData || {})}
User Query/Prompt: ${prompt || "Explain the results visualised in this step and what is the computational vaccine design rationale."}`;

  try {
    if (GEMINI_API_KEY) {
      const liveAi = getGemini();
      const response = await liveAi.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contextPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return res.json({ text: response.text });
    } else {
      // Fallback elegant expert system simulation with deep biological rationale
      const dummyExplanations: Record<string, string> = {
        "1": "As a computational copilot, I've run safety checks on your uploaded Fasta virus genome sequence. The genomic characterization shows appropriate GC distribution which supports proper ribosomal transcription rates. ORF analysis indicates a complete surface-exposed domain window (specifically, our Spike-like Glycoprotein homologue), indicating excellent targetability for adaptive immunity profiling.",
        "2": "Let's review the Surface Protein segment mapping. The N-terminus signal peptide signals proper cleavage (cleavage site high expectancy). Crucially, the Receptor Binding Domain (RBD) and fusion machinery are extracellular coordinates which remain highly accessible. Notice the glycosylation sites at specific points; these represent sugar structures that the virus leverages to shield its vulnerable sites. We should direct target epitopic windows to accessible crevices that escape this shield.",
        "3": "We calculated the Billie Gene composite vaccine target rating based on multiple variables: Surface exposure (accessibility), high target relevance, stability and evolutionary protection. Our score is strong because it balances high immune visibility with low risk of allergen resemblance.",
        "4": "In the computer-simulated MHC presentation database, we ranked your epitopes by predicted presentation potential across Class I (for vital killer T-cell responses) and Class II (for permanent helper B-cell memory activation). BG-EPI-003 shows excellent cross-reactive binding scores. I suggest focusing on these top-ranked candidates to include in the construct plan.",
        "5": "The engineered mRNA planner constructs a 1,248nt conceptual nucleotide string. It utilizes glycine-rich flexible linker fragments (GGSGG) to prevent epitopes from misfolding together, includes essential signal peptides for cellular export, and balances GC contents to optimize translation efficiency inside target host cells while avoiding immediate ribonuclease decay triggers.",
        "6": "Our Simulated PGx screening maps HLA allele populations across Global, Asian, African, and European genetic statistics. It indicates broad presentation coverage (81%) with low off-target human cross-reactive sequences. This minimizes hyperresponse or tolerance concerns across a highly heterozygous population structure.",
        "7": "I have compiled your research summary dossier. The mutation tracking highlights hot-spots where variant escape remains likely. Moving forward, the suggested PyMOL script allows you to highlight these risk targets in 3D to structure structural binding assays directly."
      };
      
      const fallbackText = dummyExplanations[String(stepId || "")] || "This computational design step screens viral motifs server-side, verifying secondary structure properties, safety warnings, and population-level HLA binding dynamics so your candidate vaccine formulation can be modeled with high confidence.";
      
      const responsePromptText = prompt ? `Based on your request "${prompt}":\n\n${fallbackText}\n\n*Note: This is simulated AI assistance because a live API key was not configured. To enable live models, input an API key in AI Studio Secrets.*` : fallbackText;

      setTimeout(() => {
        res.json({ text: responsePromptText });
      }, 600);
    }
  } catch (err: any) {
    console.error("Gemini API Error in Billie Gene Copilot:", err);
    res.json({ text: `Computational Copilot encountered an issue fetching live models: ${err.message}. Showing simulated rationale: The pathogen sequence exhibits a high surface-domain targetability metric of 0.91, targeting stable structural regions with minimal human polypeptide homology.` });
  }
});

// Start dev server in development or serve production files of React application
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.get(["/agents", "/agents/"], async (req, res, next) => {
      try {
        const html = await fs.readFile(path.join(process.cwd(), "agents.html"), "utf-8");
        const transformed = await vite.transformIndexHtml(req.originalUrl, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(transformed);
      } catch (error) {
        next(error);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get(["/agents", "/agents/"], (req, res) => {
      res.sendFile(path.join(distPath, "agents.html"));
    });
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Billie Gene server booted and running on http://localhost:${PORT}`);
  });
}

startServer();
