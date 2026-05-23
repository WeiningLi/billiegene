import { WorkflowRun, Epitope } from "./types";

export function getPresetEpitopes(virusType: string): Epitope[] {
  if (virusType.includes("Coronavirus") || virusType.includes("SARS-CoV-2")) {
    return [
      {
        id: "BG-EPI-001",
        region: "112–128",
        start: 112,
        end: 128,
        sequence: "SKTQSLLIVNNATNVVI",
        bindingScore: 91,
        mhc1Score: 89,
        mhc2Score: 92,
        bCellScore: 85,
        exposure: "High",
        conservation: 94,
        escapeRisk: "Low",
        popCoverage: 81,
        selected: true
      },
      {
        id: "BG-EPI-002",
        region: "319–335",
        start: 319,
        end: 335,
        sequence: "RVQPTESIVRFPNITNL",
        bindingScore: 84,
        mhc1Score: 82,
        mhc2Score: 85,
        bCellScore: 78,
        exposure: "Medium",
        conservation: 91,
        escapeRisk: "Low",
        popCoverage: 72,
        selected: false
      },
      {
        id: "BG-EPI-003",
        region: "411–427",
        start: 411,
        end: 427,
        sequence: "APGQTGKIADYNYKLPD",
        bindingScore: 95,
        mhc1Score: 94,
        mhc2Score: 96,
        bCellScore: 91,
        exposure: "High",
        conservation: 88,
        escapeRisk: "Medium",
        popCoverage: 89,
        selected: true
      },
      {
        id: "BG-EPI-004",
        region: "484–499",
        start: 484,
        end: 499,
        sequence: "GFQPTNGVGYQPYRVV",
        bindingScore: 78,
        mhc1Score: 72,
        mhc2Score: 81,
        bCellScore: 88,
        exposure: "High",
        conservation: 45,
        escapeRisk: "High",
        popCoverage: 62,
        selected: false
      },
      {
        id: "BG-EPI-005",
        region: "501–516",
        start: 501,
        end: 516,
        sequence: "LSFELLHAPATVCGPK",
        bindingScore: 82,
        mhc1Score: 85,
        mhc2Score: 80,
        bCellScore: 75,
        exposure: "Medium",
        conservation: 79,
        escapeRisk: "Medium",
        popCoverage: 78,
        selected: false
      },
      {
        id: "BG-EPI-006",
        region: "701–718",
        start: 701,
        end: 718,
        sequence: "GAENSVAYSNNSIAIPTN",
        bindingScore: 88,
        mhc1Score: 86,
        mhc2Score: 90,
        bCellScore: 82,
        exposure: "High",
        conservation: 97,
        escapeRisk: "Low",
        popCoverage: 85,
        selected: true
      }
    ];
  } else if (virusType.includes("Orthomyxovirus") || virusType.includes("H5N1")) {
    return [
      {
        id: "BG-EPI-101",
        region: "40–56",
        start: 40,
        end: 56,
        sequence: "NTEQVDTIMEKNVTVTH",
        bindingScore: 89,
        mhc1Score: 87,
        mhc2Score: 91,
        bCellScore: 80,
        exposure: "Medium",
        conservation: 95,
        escapeRisk: "Low",
        popCoverage: 83,
        selected: true
      },
      {
        id: "BG-EPI-102",
        region: "110–125",
        start: 110,
        end: 125,
        sequence: "LIRDCSVAGWLLGNPM",
        bindingScore: 92,
        mhc1Score: 91,
        mhc2Score: 93,
        bCellScore: 74,
        exposure: "Medium",
        conservation: 92,
        escapeRisk: "Low",
        popCoverage: 79,
        selected: true
      },
      {
        id: "BG-EPI-103",
        region: "202–218",
        start: 202,
        end: 218,
        sequence: "SSACPYQGTSSFFRNVV",
        bindingScore: 86,
        mhc1Score: 84,
        mhc2Score: 88,
        bCellScore: 82,
        exposure: "High",
        conservation: 78,
        escapeRisk: "Medium",
        popCoverage: 75,
        selected: false
      },
      {
        id: "BG-EPI-104",
        region: "291–307",
        start: 291,
        end: 307,
        sequence: "EFFWTILKPNDAINFES",
        bindingScore: 94,
        mhc1Score: 95,
        mhc2Score: 93,
        bCellScore: 85,
        exposure: "High",
        conservation: 89,
        escapeRisk: "Low",
        popCoverage: 88,
        selected: true
      }
    ];
  } else {
    // Default virus types or custom filovirus / flavivirus
    return [
      {
        id: "BG-EPI-201",
        region: "78–94",
        start: 78,
        end: 94,
        sequence: "LPLVIHNSTLQVSDVDK",
        bindingScore: 87,
        mhc1Score: 85,
        mhc2Score: 89,
        bCellScore: 78,
        exposure: "Medium",
        conservation: 94,
        escapeRisk: "Low",
        popCoverage: 80,
        selected: true
      },
      {
        id: "BG-EPI-202",
        region: "142–158",
        start: 142,
        end: 158,
        sequence: "EWAENCYNLDIKKADGS",
        bindingScore: 93,
        mhc1Score: 92,
        mhc2Score: 94,
        bCellScore: 88,
        exposure: "High",
        conservation: 83,
        escapeRisk: "Medium",
        popCoverage: 84,
        selected: true
      },
      {
        id: "BG-EPI-203",
        region: "280–296",
        start: 280,
        end: 296,
        sequence: "RYQATGFGTNETEYLFE",
        bindingScore: 91,
        mhc1Score: 89,
        mhc2Score: 93,
        bCellScore: 82,
        exposure: "High",
        conservation: 96,
        escapeRisk: "Low",
        popCoverage: 87,
        selected: true
      }
    ];
  }
}

export function generateSandboxRun(
  pathogenInput: string,
  virusType: string,
  activeAgentIds: string[],
  parallelMode: boolean,
  notes: string
): WorkflowRun {
  const latencyMultiplier = parallelMode ? 0.3 : 0.8;

  // Render highly specific outputs for vaccine workflows
  const simulatedAgents = [
    {
      id: "surf_protein",
      name: "Surface Protein Discoverer",
      skillsApplied: ["Protein Track Mapping", "Signal Peptide Detection", "Transmembrane Domains", "Ectodomain Sizing"],
      output: `### Pathogen Sequence Cleavage & Domain Slices
Analyzed current pathogen template input context (*${virusType}*). Identified key surface glycoprotein components:
*   **Target Glycoprotein Identification:** surface-exposed envelope-spike domain homolog.
*   **Calculated Sequence Segments:**
    -   **Signal Peptide:** residues 1 to 32 (Favorable probability: 94.8% via Sec/SPI)
    -   **Ectodomain (Outer core):** residues 33 to 640. Highly accessible.
    -   **Transmembrane Anchor:** residues 641 to 665 (Hydrophobic score index: 3.12, confirms binding lock)
    -   **Cytoplasmic Tail:** residues 666 to end.
*   **Targetability Classification:** **HIGH TARGETABILITY**
*   **AlphaFold Model Match:** Structure coordinates retrieved successfully. Placed structurally identical residues forming accessible receptor docking grids.`
    },
    {
      id: "annotator",
      name: "Function & Developability Annotator",
      skillsApplied: ["Solubility Profiling", "Glycosylation Shielding", "Conservation Tracking", "Score Compiling"],
      output: `### Biological Annotations & Developability Scores
*   **Biological Function:** Host cell entry attachment factor. Key ligand mediating receptor binding attachment.
*   **Glycosylation Index:** Moderate shielding detected on residues 118, 256 and 410. These sites are partially shielded but leave significant sub-pockets open to antibody penetration.
*   **Solubility Propensity:** Recombinant expression compatibility estimated at **84/100** indicating excellent wet-lab manufacturability and low aggregation risk.
*   **Composite Vaccine Target Score:** **82 / 100** based on:
    -   Surface Exposure: 91%
    -   Conservation frequency: 82%
    -   Structural stability indicator: 85%
    -   Toxicity Motif Flag: None detected.`
    },
    {
      id: "epitope_predictor",
      name: "Epitope Binding Predictor",
      skillsApplied: ["MHC-I/II Allele Binding", "B-Cell Epitope Localization", "Epitope Quality Filtering"],
      output: `### Predicted Antigen Epitope Windows
Screened target sequence segments for stable, exposed MHC-I, MHC-II, and linear B-cell epitopes. Found 3 premier candidate epitopes:
1.  **BG-EPI-001 (Region 112–128):** High binding score (91/100). Highly conserved across variant datasets with excellent CD4/CD8 coverage.
2.  **BG-EPI-003 (Region 411–427):** Extreme binding score (95/100). Located inside highly accessible receptor interaction loop domain.
3.  **BG-EPI-006 (Region 701–718):** Flawless conservation (97%), low escape risk. Highly stable binding kinetics.`
    },
    {
      id: "construct_designer",
      name: "mRNA Construct Designer",
      skillsApplied: ["Vector Map Layout", "Glycine-Serine Linker Formulation", "GC Adaptation Index", "UTRs Pairing"],
      output: `### Conceptual mRNA Construct blueprint
Formulated a safe Vaccine mRNA construct string sequence mapping layout:
-   **5' cap structure:** Standard N7-methylguanosine cap block.
-   **5' UTR:** Human α-globin derivative optimization.
-   **Signal Peptide:** Engineered IL-2 leader sequence for rapid extracellular expression.
-   **Active Epitopes:** Segment **BG-EPI-001** ─ *AAY linker* ─ **BG-EPI-003** ─ *GGGGS linker* ─ **BG-EPI-006**
-   **3' UTR:** Optimized β-globin elements.
-   **Poly(A) component:** 120-nucleotide polyadenylation tail.

### Manufacturability Score Metrics
*   **Codon Adaptation Index (CAI):** **0.89** (Exceptional human cellular expression compatibility)
*   **GC-balance index:** **53%** (Favorable secondary fold prevention profile)
*   **Translation Integrity:** **PASS** (Zero premature stop codon hazards)`
    },
    {
      id: "pgx_screener",
      name: "Pharmacogenomic Risk Screener",
      skillsApplied: ["Population Allele Coverage Map", "Auto-inflammation Hazards Identification", "Self-Similarity Filters"],
      output: `### Population-Scale Pharmacogenomic Risk Screen
*   **Estimated HLA Population Coverage:** **81.4%** across major regional registries.
*   **Autoimmune Cross-Reactivity:** Passed full blast index scan against the human proteome database. 0% matching residues > 6aa found, indicating exceptionally low autoimmune reaction risks.
*   **Hyper-responders warnings:** No elevated CD4+ hyper-activation risk patterns observed.
*   **Low HLA coverage groups:** Minor gaps in presentation predicted for HLA-B*27 alleles. Corrected by including the stable sequence Epitope BG-EPI-006.`
    }
  ];

  const ranResults = simulatedAgents
    .filter(a => activeAgentIds.includes(a.id))
    .map(a => ({
      ...a,
      latencyMs: Math.round((280 + Math.random() * 150) * latencyMultiplier),
    }));

  const totalTimeMs = Math.round(
    parallelMode
      ? Math.max(...ranResults.map(r => r.latencyMs)) + 200
      : ranResults.reduce((acc, r) => acc + r.latencyMs, 0) + 150
  );

  const masterDossier = `
# Billie Gene - Computational Vaccine Candidate Dossier
**Target Virus Type:** ${virusType}
**Pathogen Sequence Length:** ${pathogenInput.substring(0, 40).replace(/[^a-zA-Z]/g, "").length} aa sequence
**Orchestration Mode:** Interactive Stepper Simulation (Sandbox)

---

### 1. Executive Summary & Cover Sheet
This report compiles the computational vaccine design dossier formulated by Billie Gene's coordinated multi-agent workflow. The selected pathogen antigens have been checked for surface-exposure accessibility, functional essentiality, optimal HLA binding, and population-level pharmacogenomic safety.

*   **Candidate ID:** BG-CANDIDATE-${Math.floor(100 + Math.random() * 900)}
*   **Overall Bio-Feasibility Classification:** RECOMMENDED FOR STUDY
*   **Total Composite Target Score:** **84 / 100**
*   **Overall Risk Confidence:** Medium-High

---

### 2. Primary Target & Protein Segmentation Map
The most promising vaccine target identified is the surface envelope glycoprotein.
*   **Signal Peptide offset:** Residues 1-32 (Cleavage site prediction score: 0.95)
*   **Extracellular domain boundaries:** Residues 33-640 (High antibody visibility)
*   **Transmembrane region:** Residues 641-665 (Provides anchor fold structure)
*   **Cytoplasmic Tail pocket:** Residues 666-end

---

### 3. Function & Developability Rationale
-   **Primary Role:** Host cellular receptor docking, facilitating virus entrance. Targeting this protein should result in high neutralizing antibody efficacy.
-   **Solubility and Manufacturability:** Mapped solubility score is **84/100**, indicating rapid construct stability and negligible wet-lab expression hurdles.
-   **Conservation Status:** The core binding domain remains conserved (>88%) across clinical lineages, protecting the vaccine from easy mutation escape.

---

### 4. Selected Ranked Epitopes
| ID | Offset Window | Sequence Segment | Binding Score | Conservation | Escape Risk | Decision |
|:---|:---:|:---|:---:|:---:|:---:|:---|
| **BG-EPI-001** | 112–128 | SKTQSLLIVNNATNVVI | 91 / 100 | 94% | Low | **INCLUDE** |
| **BG-EPI-003** | 411–427 | APGQTGKIADYNYKLPD | 95 / 100 | 88% | Medium | **INCLUDE** |
| **BG-EPI-006** | 701–718 | GAENSVAYSNNSIAIPTN | 88 / 100 | 97% | Low | **INCLUDE** |

---

### 5. Conceptual mRNA Construct Specifications
-   **Layout Topology:** \`5' Cap - 5' UTR - Signal Peptide - EPI-001 - Linker - EPI-003 - Linker - EPI-006 - 3' UTR - Poly(A)\`
-   **Sequence Length:** 1,248 nt conceptual construct.
-   **Codon Optimization Ratio:** CAI index is **0.89**, indicating efficient translation.
-   **GC balance percentage:** **53%**, preventing problematic RNA hairpins or secondary structure folding issues.

---

### 6. Pharmacogenomic Host Risk Assessment
-   **Predicted Population HLA Presentation Coverage:** **81.4%** global allele representation.
-   **Cross-Reactivity Alert:** Cleared. Fully aligned against the human reference proteome with zero high-confidence similarity flags.
-   **Safety Recommendation:** Progress as a computed vaccine prototype. Proceed to wet-lab immunogenicity assays in transgenic HLA-expressing murine models.

---

### 7. Next-Phase Validation & In Vitro Assay Protocol
To transition from software simulation to physical assays, we recommend the following validation steps:
1.  **Synthetic mRNA Preparation:** Synthesize mRNA using t7 RNA polymerase transcription and incorporate pseudouridine modifications.
2.  **Transfection & Expression Level:** Transfect HEK293T cells and evaluate expression levels using Western Blot validation.
3.  **Binding Affinity Assay:** Quantify active binding affinity (Kd) to target recombinant antibodies using Microscale Thermophoresis (MST).
`;

  return {
    id: "BG-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    timestamp: new Date().toISOString(),
    pathogenInput,
    virusType,
    coordinatorPlan: "Trigger surface glycoprotein scanner -> Map ectodomain boundaries -> Rank MHC immunogenic epitopes -> Optimize vector linkages -> Verify autoimmune host similarity.",
    agentsRan: ranResults,
    masterDossier,
    parallelMode,
    totalTimeMs
  };
}
