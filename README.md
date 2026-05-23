# Billie Gene

Billie Gene is a research-use prototype for exploring protein structure modeling in a guided vaccine-design workflow. The default UI is the original standalone `index.html` app from this repository.

The prototype is intended for computational exploration and education only. It does not generate clinically validated vaccine products, therapeutic recommendations, or wet-lab-ready protocols.

## Features

- Six-step horizontal workflow for sequence intake, surface protein ranking, structure modeling, epitope scoring, mRNA construct preview, and candidate dossier review.
- DNA, RNA, protein, and FASTA paste support with local sequence file upload.
- Automatic DNA/RNA reading-frame scan that proposes translated protein candidates for folding.
- Live ESM Atlas folding through the public `foldSequence` API.
- Local demo model from `esmfold-demo.pdb`.
- Browser-based 3D structure viewer using 3Dmol.js with a 2D fallback when WebGL is unavailable.

## Project Structure

```text
.
├── index.html
├── protein-model-screen.html
├── esmfold-demo.pdb
├── Billie Gene.pdf
├── src/
├── public/
├── server.ts
└── package.json
```

The root `index.html` is the original Billie Gene interface. The merged React agent workbench from `tmp1` is available at `/agents` and is linked from the original page header.

## Run Locally

Prerequisite: Node.js 20 or newer is recommended.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

Open the agent workbench:

```text
http://localhost:3000/agents
```

`GEMINI_API_KEY` is optional and only affects the merged backend API from `tmp1`; the original standalone page does not require it.

## Production Build

```bash
npm run build
npm start
```

## Static Server Alternative

The original page can also run without Node:

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/index.html
```

## License

This project is licensed under the MIT License. See `LICENSE` for details.
