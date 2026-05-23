import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return <span className="text-slate-500 italic">No content generated.</span>;
  }

  // Parse markdown into lines and render robustly
  const lines = content.split("\n");

  let insideCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = "";

  const elements: React.ReactNode[] = [];

  const flushCodeBlock = (index: number) => {
    if (codeBlockLines.length > 0) {
      elements.push(
        <div key={`code-${index}`} className="my-4 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto">
          {codeBlockLang && (
            <div className="mb-2 text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1">
              {codeBlockLang}
            </div>
          )}
          <pre className="whitespace-pre">{codeBlockLines.join("\n")}</pre>
        </div>
      );
      codeBlockLines = [];
      codeBlockLang = "";
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code block wrappers
    if (line.trim().startsWith("```")) {
      if (insideCodeBlock) {
        flushCodeBlock(i);
        insideCodeBlock = false;
      } else {
        insideCodeBlock = true;
        codeBlockLang = line.trim().replace("```", "") || "output";
      }
      continue;
    }

    if (insideCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Parse Inline styling helper: bold words, italic words, links
    const parseFormattedText = (txt: string): React.ReactNode => {
      // Very simple inline markdown formatter
      // Handles bold **abc**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(txt)) !== null) {
        if (match.index > lastIndex) {
          parts.push(txt.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={`bold-${match.index}`} className="font-extrabold text-teal-brand">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < txt.length) {
        parts.push(txt.substring(lastIndex));
      }

      // Handle raw markdown Link [name](url)
      const linkRegex = /\[(.*?)\]\(((?:http|https):\/\/[^\s)]+)\)/g;
      const finalParts: React.ReactNode[] = [];
      
      const txtString = parts.map((p, idx) => {
        if (typeof p === "string") {
          let lastLIdx = 0;
          let lMatch;
          const pieces: React.ReactNode[] = [];
          
          while ((lMatch = linkRegex.exec(p)) !== null) {
            if (lMatch.index > lastLIdx) {
              pieces.push(p.substring(lastLIdx, lMatch.index));
            }
            pieces.push(
              <a
                key={`link-${lMatch.index}`}
                href={lMatch[2]}
                target="_blank"
                rel="noreferrer"
                className="text-blue-brand underline hover:text-blue-700 inline-flex items-center gap-0.5 ml-1 mr-1 font-bold"
              >
                {lMatch[1]}
              </a>
            );
            lastLIdx = linkRegex.lastIndex;
          }
          if (lastLIdx < p.length) {
            pieces.push(p.substring(lastLIdx));
          }
          return <React.Fragment key={`frag-${idx}`}>{pieces}</React.Fragment>;
        }
        return p;
      });

      return <>{txtString.length > 0 ? txtString : txt}</>;
    };

    const trimmed = line.trim();

    // Check Headers
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={i} className="mt-8 mb-4 font-sans text-2xl font-black tracking-tight text-black border-b border-line pb-2">
          {parseFormattedText(trimmed.substring(2))}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="mt-6 mb-3 font-sans text-xl font-extrabold tracking-tight text-black border-b border-dashed border-line pb-1">
          {parseFormattedText(trimmed.substring(3))}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-5 mb-2 font-sans text-base font-bold text-black">
          {parseFormattedText(trimmed.substring(4))}
        </h3>
      );
    } else if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="mt-4 mb-2 font-sans text-xs font-bold text-black uppercase tracking-wider">
          {parseFormattedText(trimmed.substring(5))}
        </h4>
      );
    }
    // Check Lists
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="ml-4 pl-2 border-l-2 border-slate-200 my-1.5 py-0.5 text-black text-sm">
          <span className="text-teal-brand mr-2 font-extrabold">•</span>
          {parseFormattedText(trimmed.substring(2))}
        </div>
      );
    }
    // Check Ordered Lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      const num = match ? match[1] : "1";
      const rest = match ? match[2] : trimmed;
      elements.push(
        <div key={i} className="ml-4 pl-2 border-l-2 border-slate-200 my-1.5 py-0.5 text-black text-sm">
          <span className="text-teal-brand mr-2 font-bold font-mono">{num}.</span>
          {parseFormattedText(rest)}
        </div>
      );
    }
    // Check Blockquotes
    else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="my-3 border-l-4 border-teal-brand bg-slate-50 px-4 py-3 text-sm text-black rounded-r-lg italic">
          {parseFormattedText(trimmed.substring(2))}
        </blockquote>
      );
    }
    // Check dividers
    else if (trimmed === "---") {
      elements.push(<hr key={i} className="my-6 border-line" />);
    }
    // Paragraph
    else if (trimmed.length > 0) {
      elements.push(
        <p key={i} className="my-2.5 text-sm text-black leading-relaxed">
          {parseFormattedText(line)}
        </p>
      );
    } else {
      // Empty line / spacer
      elements.push(<div key={i} className="h-2" />);
    }
  }

  // Just in case final block didn't close
  if (insideCodeBlock) {
    flushCodeBlock(lines.length);
  }

  return <div className="space-y-1 font-sans">{elements}</div>;
}
