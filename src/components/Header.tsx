import { Activity, ShieldAlert } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans text-xl font-bold tracking-tight text-white">Billie Gene</h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                v1.1 Prototype
              </span>
            </div>
            <p className="text-xs text-zinc-400 tracking-wide">
              From sequence to vaccine strategy — one guided step at a time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-amber-600/30 bg-amber-500/10 p-2.5 text-zinc-300 max-w-xl">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-[10.5px] leading-relaxed text-amber-300">
            <strong className="font-semibold text-amber-200">Research Use Disclaimer:</strong> Non-clinical prototype for educational demonstration/molecular exploration. Does not generate clinically validated vaccine formulations, therapeutic recommendations, or wet-lab recipes.
          </p>
        </div>
      </div>
    </header>
  );
}
