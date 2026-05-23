export interface AminoAcidNode {
  index: number;
  code: string;
  name: string;
  codon: string;
  x: number;
  y: number;
  z: number;
  domainName: string;
  domainColor: string;
  plddt: number;
  secondaryStructure: "Helix" | "Sheet" | "Loop";
}

const THREE_TO_ONE: Record<string, string> = {
  ALA: 'A', ARG: 'R', ASN: 'N', ASP: 'D', CYS: 'C',
  GLN: 'Q', GLU: 'E', GLY: 'G', HIS: 'H', ILE: 'I',
  LEU: 'L', LYS: 'K', MET: 'M', PHE: 'F', PRO: 'P',
  SER: 'S', THR: 'T', TRP: 'W', TYR: 'Y', VAL: 'V',
  ASX: 'N', GLX: 'Q', UNK: 'X'
};

const AMINO_ACID_NAMES: Record<string, string> = {
  A: "Alanine", R: "Arginine", N: "Asparagine", D: "Aspartic Acid",
  C: "Cysteine", Q: "Glutamine", E: "Glutamic Acid", G: "Glycine",
  H: "Histidine", I: "Isoleucine", L: "Leucine", K: "Lysine",
  M: "Methionine", F: "Phenylalanine", P: "Proline", S: "Serine",
  T: "Threonine", W: "Tryptophan", Y: "Tyrosine", V: "Valine",
  X: "Unknown"
};

export function parsePDBToNodes(pdbText: string): AminoAcidNode[] {
  const nodes: AminoAcidNode[] = [];
  const lines = pdbText.split(/\r?\n/);
  
  // First step: extract CA atoms
  for (const line of lines) {
    if (!line.startsWith("ATOM")) continue;
    
    const atomName = line.slice(12, 16).trim();
    if (atomName !== "CA") continue;
    
    const indexStr = line.slice(22, 26).trim();
    const index = parseInt(indexStr, 10);
    if (isNaN(index)) continue;
    
    const resThree = line.slice(17, 20).trim().toUpperCase();
    const code = THREE_TO_ONE[resThree] || 'X';
    const name = AMINO_ACID_NAMES[code] || "Unknown";
    
    const x = parseFloat(line.slice(30, 38));
    const y = parseFloat(line.slice(38, 46));
    const z = parseFloat(line.slice(46, 54));
    
    const occupancy = parseFloat(line.slice(54, 60));
    const bFactor = parseFloat(line.slice(60, 66));
    
    if (isNaN(x) || isNaN(y) || isNaN(z)) continue;
    
    // ESMFold stores pLDDT in B-factor field, either normalized (0 to 1) or directly (0 to 100)
    let plddt = isNaN(bFactor) ? 70 : bFactor;
    if (plddt <= 1.0) {
      plddt = Math.round(plddt * 100);
    } else {
      plddt = Math.round(plddt);
    }
    plddt = Math.max(0, Math.min(100, plddt));
    
    // Assign domain classification proportionally based on parsed length
    // We will update domain properties after parsing full sequence dynamically
    nodes.push({
      index,
      code,
      name,
      codon: "Protein Residue",
      x,
      y,
      z,
      domainName: "Extracellular Core",
      domainColor: "#10b981",
      plddt,
      secondaryStructure: "Loop"
    });
  }

  // Assign domains and secondary structures dynamically based on sequence
  const total = nodes.length || 1;
  nodes.forEach((node, idx) => {
    // 1. Assign Domain classifications
    if (idx < Math.ceil(total * 0.05)) {
      node.domainName = "Signal Peptide";
      node.domainColor = "#3b82f6";
    } else if (idx < Math.ceil(total * 0.25)) {
      node.domainName = "Extracellular Region";
      node.domainColor = "#10b981";
    } else if (idx < Math.ceil(total * 0.55)) {
      node.domainName = "Receptor Binding domain";
      node.domainColor = "#a855f7";
    } else if (idx < Math.ceil(total * 0.85)) {
      node.domainName = "Conformational Spike Helix";
      node.domainColor = "#06b6d4";
    } else {
      node.domainName = "Transmembrane Anchor";
      node.domainColor = "#ef4444";
    }

    // 2. Assign secondary structure (beautiful coiling visual wave patterns if not explicitly parsed)
    // Helices are coiled, sheets are pleated, loops are endpoints and connectors
    if (idx < 12 || idx > total - 12) {
      node.secondaryStructure = "Loop";
    } else {
      const cycle = idx % 40;
      if (cycle < 18) {
        node.secondaryStructure = "Helix";
      } else if (cycle < 32) {
        node.secondaryStructure = "Sheet";
      } else {
        node.secondaryStructure = "Loop";
      }
    }
  });

  return normalizeCoordinates(nodes);
}

function normalizeCoordinates(raw: AminoAcidNode[]): AminoAcidNode[] {
  if (raw.length === 0) return [];
  
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const node of raw) {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
    if (node.z < minZ) minZ = node.z;
    if (node.z > maxZ) maxZ = node.z;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const spanZ = maxZ - minZ || 1;
  const maxSpan = Math.max(spanX, spanY, spanZ);
  
  // Normalize bounds nicely within 130px radius mapping
  const scaleFactor = 130 / maxSpan;

  return raw.map(node => ({
    ...node,
    x: (node.x - centerX) * scaleFactor,
    y: (node.y - centerY) * scaleFactor,
    z: (node.z - centerZ) * scaleFactor
  }));
}
