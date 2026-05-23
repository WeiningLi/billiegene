# Billie Gene

Billie Gene is a research-use prototype for exploring protein structure modeling in a guided vaccine-design workflow. The current app focuses on the protein model screen: it accepts a protein amino acid sequence, sends it to ESM Atlas for ESMFold structure prediction, and renders the resulting PDB structure in the browser.

The prototype is intended for computational exploration and education only. It does not generate clinically validated vaccine products, therapeutic recommendations, or wet-lab-ready protocols.

## Features

- Protein sequence input with the ESM Atlas 400 amino acid limit surfaced in the UI.
- Live ESM Atlas folding through the public `foldSequence` API.
- Local demo model from `esmfold-demo.pdb`.
- Browser-based 3D structure viewer using 3Dmol.js.
- PDB-derived 2D fallback rendering when WebGL is unavailable.
- Model summary metrics for residues, atoms, and mean local confidence.
- Surface protein and candidate epitope track mockup for downstream screening.

## Project Structure

```text
.
├── index.html
├── protein-model-screen.html
├── esmfold-demo.pdb
├── Billie Gene.pdf
├── LICENSE
└── README.md
```

## Run Locally

Start a local static server from the project directory:

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/index.html
```

The app needs to be served over HTTP so the browser can load the local PDB file and the 3D viewer library reliably.

## Use ESM Atlas

ESM Atlas provides a public ESMFold endpoint that accepts one protein sequence and returns a PDB model.

```bash
curl -X POST \
  --data "YOUR_AMINO_ACID_SEQUENCE" \
  https://api.esmatlas.com/foldSequence/v1/pdb/ \
  > model.pdb
```

Notes:

- The public Fold Sequence tool accepts protein sequences up to 400 amino acids.
- The API is rate limited and should be used for a few exploratory predictions, not batch folding.
- Predicted structures should be reviewed carefully, especially low-confidence regions.

## Data Source

The demo PDB file was generated with the ESM Atlas ESMFold API from the sample sequence included in the app. Per-residue local confidence is read from the PDB B-factor field and visualized with the low-to-high confidence color legend.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
