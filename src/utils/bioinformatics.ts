// =========================================================================
// BIOINFORMATICS KERNEL FOR RECURSIVE SIX-FRAME TRANSLATION AND REFERENCE MATCHING
// =========================================================================

export interface ORFModel {
  id: string;
  strand: "+" | "-";
  frame: number; // 1, 2, 3 or -1, -2, -3
  startNucleotide: number;
  endNucleotide: number;
  peptideLength: number;
  aminoAcidSeq: string;
  underlyingDNASeq: string;
  gcContent: number;
  referenceMatch: {
    targetName: string;
    similarityScore: number; // percentage match value (0-100)
    alignmentRegion: string;
  } | null;
}

// Codon to Amino Acid lookup table
export const CODON_TABLE: Record<string, string> = {
  "ATG": "M", // Start
  "GCT": "A", "GCC": "A", "GCA": "A", "GCG": "A",
  "TGT": "C", "TGC": "C",
  "GAT": "D", "GAC": "D",
  "GAA": "E", "GAG": "E",
  "TTT": "F", "TTC": "F",
  "GGT": "G", "GGC": "G", "GGA": "G", "GGG": "G",
  "CAT": "H", "CAC": "H",
  "ATT": "I", "ATC": "I", "ATA": "I",
  "AAA": "K", "AAG": "K",
  "TTA": "L", "TTG": "L", "CTT": "L", "CTC": "L", "CTA": "L", "CTG": "L",
  "AAT": "N", "AAC": "N",
  "CCT": "P", "CCC": "P", "CCA": "P", "CCG": "P",
  "CAA": "Q", "CAG": "Q",
  "CGT": "R", "CGC": "R", "CGA": "R", "CGG": "R", "AGA": "R", "AGG": "R",
  "TCT": "S", "TCC": "S", "TCA": "S", "TCG": "S", "AGT": "S", "AGC": "S",
  "ACT": "T", "ACC": "T", "ACA": "T", "ACG": "T",
  "GTT": "V", "GTC": "V", "GTA": "V", "GTG": "V",
  "TGG": "W",
  "TAT": "Y", "TAC": "Y",
  // Stop codons
  "TAA": "*", "TAG": "*", "TGA": "*"
};

// Target reference proteins for alignment comparison
export const REFERENCE_ANTIGENS = {
  sars_cov_2: {
    key: "sars_cov_2",
    name: "SARS-CoV-2 Spike Glycoprotein (Omicron BA.5)",
    peptide: "MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFRSSVLHSTQDLFLPFFSNVTWFHAIHVSGTNGTKRFDNPVLPFNDGVYFASTEKSNIIRGWIFGTTLDSKTQSLLIVNNATNVVIKVCEFQFCNDPFLGVYYHKNNKSWMESEFRVYSSANNCTFEYVSQPFLMDLEGKQGNFKNLREFVFKIDGYFKIYSKHTPINLVRDLPQGFSALEPLVDLPIGINITRFQTLLALHRSYLTPGDSSSGWTAGSA"
  },
  influenza_h5n1: {
    key: "influenza_h5n1",
    name: "Influenza A Virus H5N1 (Vietnam/1203/2004 HA)",
    peptide: "MEKIVLLFAIVSLVKSDQICIGYHANNSTEQVDTIMEKNVTVTHAQDILEKKHNGKLCDLDGVKPLILRDCSVAGWLLGNPMCDEFINVPEWSYIVEKANPVNDLCYPGDFNDYEELKHLLSRINHFEKIQIIPKSSWSSHEASLGVSSACPYQGKSSFFRNVVWLIKKNSTYPTIKRSYNNTNQEDLLVLWGIHHPNDAAEQTKLYQNPTTYISVGTSTLNQRLVPRIATRSKVNGQSGRMEFFWTILKPNDAINFESNGNFIAPEYAYKIVKKGDSTIMKSELEYGNCNTKCQTPMGAINSSMPFHNIHPLTIGECPKYVKSNRLVLA"
  },
  zika_virus: {
    key: "zika_virus",
    name: "Zika Virus Envelope Glycoprotein",
    peptide: "IRCIGVSNRDFVEGMSGGTWVDVVLEHGGCVTVMAQDKPTVDIELVTTTVSNMAEVRSYCYEASISDMASDSRCPTQGEAYLDKQSDTQYVCKRTLVDRGWGNGCGLFGKGSLVTCAKFACSKKMTGKSIQPENLEYRIMLSVHGSQHSGMIVNDTGHETDENRAKVEITPNSPRAEATLGGFGSLGLDCEPRTGLDFSDLYYLTMNNKHWLVHKEWFHDIPLPWHAGADTGTPHWNNKEALVEFKDAHAKRQTVVVLGSQEGAVHTALAGALEAEMDGAKGRLSSGHLKCRLKMDKLRLKGVSYSLCTAAFTFTKIPAETLHGTVTV"
  }
};

/**
 * Computes the reverse complement of a nucleotide strand
 */
export function getReverseComplement(dna: string): string {
  const complements: Record<string, string> = {
    "A": "T", "T": "A", "C": "G", "G": "C",
    "U": "A", "N": "N"
  };
  return dna
    .toUpperCase()
    .split("")
    .reverse()
    .map(base => complements[base] || base)
    .join("");
}

/**
 * Calculates GC Content percentage of a sequence
 */
export function getGCContent(dna: string): number {
  if (!dna) return 0;
  const cleaned = dna.replace(/[^ATCGU]/gi, "").toUpperCase();
  if (cleaned.length === 0) return 0;
  const gcCount = (cleaned.match(/[GC]/g) || []).length;
  return Number(((gcCount / cleaned.length) * 100).toFixed(1));
}

/**
 * Standardizes DNA input, removing headers, whitespace, and non-nucleotide text
 */
export function cleanDNASequence(raw: string): string {
  const lines = raw.trim().split("\n");
  const filtered = lines.filter(line => !line.startsWith(">")).join("");
  return filtered.toUpperCase().replace(/[^ATCGU]/g, "").replace(/U/g, "T");
}

/**
 * Translates a single reading frame with a starting index
 */
export function translateSequence(dna: string): string {
  let peptide = "";
  for (let i = 0; i < dna.length - 2; i += 3) {
    const codon = dna.substring(i, i + 3);
    peptide += CODON_TABLE[codon] || "X"; // X for unknown/unmatched codon
  }
  return peptide;
}

/**
 * Computes k-mer similarity score between two peptide strings (using 3-mers)
 * This is extremely robust for alignment comparison since proteins may have gaps or shifts
 */
export function computeKmerScore(seq1: string, seq2: string, k: number = 3): number {
  if (!seq1 || !seq2) return 0;
  
  const getKmers = (seq: string) => {
    const kmers = new Set<string>();
    for (let i = 0; i <= seq.length - k; i++) {
      kmers.add(seq.substring(i, i + k));
    }
    return kmers;
  };

  const kmers1 = getKmers(seq1);
  const kmers2 = getKmers(seq2);
  
  if (kmers1.size === 0 || kmers2.size === 0) return 0;

  let intersection = 0;
  kmers1.forEach(kmer => {
    if (kmers2.has(kmer)) {
      intersection++;
    }
  });

  const union = kmers1.size + kmers2.size - intersection;
  // Calculate percentage matching Jaccard similarity coefficient weighted for peptide relevance
  const score = (intersection / union) * 100;
  
  // Also add a local segment similarity boost for size proportional match
  const lengthRatio = Math.min(seq1.length, seq2.length) / Math.max(seq1.length, seq2.length);
  const composite = (score * 0.75) + (lengthRatio * 25);
  return Number(Math.min(100, composite).toFixed(1));
}

/**
 * Recursively scans both strands (+ and -) and all 6 reading frames to identify potential ORFs
 * and scores each translated candidate against the current reference researches.
 */
export function findOpenReadingFrames(rawDNA: string): ORFModel[] {
  const cleanDNA = cleanDNASequence(rawDNA);
  if (cleanDNA.length < 30) return []; // Too short to analyze safely

  const reverseComplement = getReverseComplement(cleanDNA);
  const len = cleanDNA.length;
  const orfs: ORFModel[] = [];
  let orfCounter = 1;

  // Process Both Strands (+ for Forward, - for Reverse Complement)
  const strands = [
    { label: "+", sequence: cleanDNA },
    { label: "-", sequence: reverseComplement }
  ] as const;

  for (const { label: strandSign, sequence: strandSeq } of strands) {
    // 3 Reading Frames for each strand
    for (let frameOffset = 0; frameOffset < 3; frameOffset++) {
      const frameNum = strandSign === "+" ? (frameOffset + 1) : -(frameOffset + 1);
      
      // We will look for sequences starting with ATG (M) and ending with Stop codon (*)
      // To run a recursive scan, we traverse base by base along the frame offset coordinate
      let inOrf = false;
      let orfStartBase = -1;
      let currentCodons: string[] = [];

      for (let i = frameOffset; i <= strandSeq.length - 3; i += 3) {
        const codon = strandSeq.substring(i, i + 3);
        const aa = CODON_TABLE[codon] || "X";

        if (!inOrf) {
          if (aa === "M") {
            inOrf = true;
            orfStartBase = i;
            currentCodons = [codon];
          }
        } else {
          currentCodons.push(codon);
          if (aa === "*") {
            // STOP CODON hit: We lock this ORF if it represents a functional peptide (min length ~10 AA)
            const aaLength = currentCodons.length - 1; // omit stop *
            if (aaLength >= 12) {
              const underlyingDNAStr = currentCodons.join("");
              const aaStr = currentCodons.map(c => CODON_TABLE[c] || "X").slice(0, -1).join("");
              
              // Calculate mapping indices back on the positive strand coordinates
              let startNucl = 0;
              let endNucl = 0;
              
              if (strandSign === "+") {
                startNucl = orfStartBase + 1;
                endNucl = orfStartBase + underlyingDNAStr.length;
              } else {
                // Reverse complement strand coordinates map backwards on raw DNA
                startNucl = len - (orfStartBase + underlyingDNAStr.length) + 1;
                endNucl = len - orfStartBase;
              }

              // Run matching score comparisons across our active research models
              let bestMatch: ORFModel["referenceMatch"] = null;
              let highestScore = -1;

              for (const key of Object.keys(REFERENCE_ANTIGENS) as Array<keyof typeof REFERENCE_ANTIGENS>) {
                const ref = REFERENCE_ANTIGENS[key];
                const similarity = computeKmerScore(aaStr, ref.peptide);
                if (similarity > highestScore) {
                  highestScore = similarity;
                  bestMatch = {
                    targetName: ref.name,
                    similarityScore: similarity,
                    alignmentRegion: `Aligned ${Math.min(aaStr.length, ref.peptide.length)} residues`
                  };
                }
              }

              orfs.push({
                id: `BG-ORF-${String(orfCounter++).padStart(3, "0")}`,
                strand: strandSign,
                frame: frameNum,
                startNucleotide: startNucl,
                endNucleotide: endNucl,
                peptideLength: aaLength,
                aminoAcidSeq: aaStr,
                underlyingDNASeq: underlyingDNAStr,
                gcContent: getGCContent(underlyingDNAStr),
                referenceMatch: highestScore > 10 ? bestMatch : null // Filter noise below 10%
              });
            }
            inOrf = false;
            currentCodons = [];
          }
        }
      }

      // Check for partial trailing draft ORF if it didn't find stop codon but sequence ended
      if (inOrf && currentCodons.length >= 25) {
        const underlyingDNAStr = currentCodons.join("");
        const aaStr = currentCodons.map(c => CODON_TABLE[c] || "X").join("");
        
        let startNucl = 0;
        let endNucl = 0;
        if (strandSign === "+") {
          startNucl = orfStartBase + 1;
          endNucl = orfStartBase + underlyingDNAStr.length;
        } else {
          startNucl = len - (orfStartBase + underlyingDNAStr.length) + 1;
          endNucl = len - orfStartBase;
        }

        let bestMatch: ORFModel["referenceMatch"] = null;
        let highestScore = -1;

        for (const key of Object.keys(REFERENCE_ANTIGENS) as Array<keyof typeof REFERENCE_ANTIGENS>) {
          const ref = REFERENCE_ANTIGENS[key];
          const similarity = computeKmerScore(aaStr, ref.peptide);
          if (similarity > highestScore) {
            highestScore = similarity;
            bestMatch = {
              targetName: ref.name,
              similarityScore: similarity,
              alignmentRegion: `Trailing match (${aaStr.length} aa)`
            };
          }
        }

        orfs.push({
          id: `BG-ORF-${String(orfCounter++).padStart(3, "0")}`,
          strand: strandSign,
          frame: frameNum,
          startNucleotide: startNucl,
          endNucleotide: endNucl,
          peptideLength: currentCodons.length,
          aminoAcidSeq: aaStr,
          underlyingDNASeq: underlyingDNAStr,
          gcContent: getGCContent(underlyingDNAStr),
          referenceMatch: highestScore > 10 ? bestMatch : null
        });
      }
    }
  }

  // Sort candidate ORFs by similarity score first, then length
  return orfs.sort((a, b) => {
    const scoreA = a.referenceMatch?.similarityScore || 0;
    const scoreB = b.referenceMatch?.similarityScore || 0;
    if (Math.abs(scoreA - scoreB) > 0.05) {
      return scoreB - scoreA;
    }
    return b.peptideLength - a.peptideLength;
  });
}
