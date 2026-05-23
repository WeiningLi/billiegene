import React, { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, Send, RefreshCw, AlertCircle, Bot } from "lucide-react";

interface CopilotCardProps {
  stepId: number;
  stepTitle: string;
  stateData: any;
}

export default function CopilotCard({ stepId, stepTitle, stateData }: CopilotCardProps) {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const fetchedForStep = useRef<number | null>(null);

  const fetchExplanation = async (customQuery?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/explain-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId,
          stepTitle,
          stateData,
          prompt: customQuery || ""
        })
      });

      if (!res.ok) {
        throw new Error("Failed to contact the Billie Gene server-side model backend.");
      }

      const data = await res.json();
      setResponse(data.text || "No insights found.");
    } catch (err: any) {
      setError(err.message || "An expected process warning occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch explanation when stepId changes so researchers get smart analysis instantly
  useEffect(() => {
    if (fetchedForStep.current !== stepId) {
      fetchExplanation();
      fetchedForStep.current = stepId;
    }
  }, [stepId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    fetchExplanation(inputQuery);
    setInputQuery("");
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm self-start">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-white">Billie Gene Copilot</h3>
            <p className="text-[10px] text-zinc-400">Contextual scientific reasoning companion</p>
          </div>
        </div>

        <button
          onClick={() => fetchExplanation()}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
          title="Refresh insight"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          <span className="hidden md:inline">Re-analyze</span>
        </button>
      </div>

      <div className="space-y-3.5 mb-4">
        {loading ? (
          <div className="space-y-2 py-4">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3"></div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded p-3 text-xs leading-normal">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="text-xs text-zinc-300 space-y-2.5 leading-relaxed bg-zinc-950/40 border border-zinc-800/40 p-4.5 rounded-lg">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[10px] uppercase tracking-wider mb-1">
              <Bot className="h-3.5 w-3.5" />
              <span>Bioinformatics Copilot Insights</span>
            </div>
            <p className="whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask analytical questions (e.g. 'explain escape dynamics')"
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 transition disabled:opacity-40 disabled:scale-100"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
