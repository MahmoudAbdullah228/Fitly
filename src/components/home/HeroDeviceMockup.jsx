import React from 'react';
import ScoreRing from '../ui/ScoreRing.jsx';
import Badge from '../ui/Badge.jsx';
import Chip from '../ui/Chip.jsx';
import { Sparkles, Check, Briefcase, MapPin, Bookmark } from 'lucide-react';

export default function HeroDeviceMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto pt-6 pb-2">
      {/* Layered Composite Container */}
      <div className="relative mx-auto flex items-center justify-center">
        
        {/* 1. MacBook Frame (Laptop Mockup) */}
        <div className="w-full max-w-[760px] rounded-xl border border-hairline-strong bg-surface-dark p-2 sm:p-3 shadow-2xl transition-all duration-300">
          {/* Laptop Screen Bezel */}
          <div className="rounded-lg bg-surface-dark-elevated overflow-hidden border border-white/10">
            
            {/* macOS Chrome Bar */}
            <div className="h-7 bg-[#1c1c1e] px-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[11px] font-mono text-white/40 truncate">
                fitly.app/matches — Cairo Top 10 Feed
              </div>
              <div className="w-8" />
            </div>

            {/* Laptop Screen Content: Fitly Dashboard */}
            <div className="bg-canvas p-4 sm:p-5 space-y-3.5 text-left select-none pointer-events-none">
              
              {/* Top mini-bar */}
              <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-black text-white text-[10px] font-bold flex items-center justify-center">F</span>
                  <span className="text-xs font-semibold text-ink">Fitly Matches</span>
                  <Badge variant="success" size="sm">Active Profile</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-body">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>10 Ranked Matches</span>
                </div>
              </div>

              {/* Sample High Match Job Row 1 */}
              <div className="p-3.5 rounded-lg border border-hairline-strong bg-white shadow-xs flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">React Frontend Engineer</span>
                    <Badge variant="source" size="sm">LinkedIn</Badge>
                  </div>
                  <div className="text-[11px] text-body flex items-center gap-2">
                    <span>CairoFin Technologies</span>
                    <span>•</span>
                    <span>New Cairo (Hybrid)</span>
                    <span>•</span>
                    <span className="font-semibold text-ink">22K - 30K EGP</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">✓ React</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">✓ TypeScript</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">✓ Tailwind</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-lg font-mono font-bold text-emerald-600">98%</span>
                    <span className="block text-[9px] uppercase font-semibold text-emerald-700 tracking-wider">Great Fit</span>
                  </div>
                </div>
              </div>

              {/* Sample High Match Job Row 2 */}
              <div className="p-3.5 rounded-lg border border-hairline bg-canvas-soft/80 flex items-center justify-between gap-3 hidden sm:flex">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Junior Frontend Developer (React & TypeScript)</span>
                    <Badge variant="source" size="sm">Wuzzuf</Badge>
                  </div>
                  <div className="text-[11px] text-body flex items-center gap-2">
                    <span>NilePay Solutions</span>
                    <span>•</span>
                    <span>Cairo (Smart Village)</span>
                    <span>•</span>
                    <span className="font-semibold text-ink">20K - 28K EGP</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-mono font-bold text-emerald-600">95%</span>
                  <span className="block text-[9px] uppercase font-semibold text-emerald-700 tracking-wider">Great Fit</span>
                </div>
              </div>

            </div>
          </div>

          {/* Laptop Base Stand Hint */}
          <div className="h-2 w-32 bg-white/20 mx-auto mt-2 rounded-b" />
        </div>

        {/* 2. iPhone Frame (Mobile Mockup Overlaid on Right Side) */}
        <div className="absolute -bottom-6 -right-2 sm:-right-6 w-[200px] sm:w-[240px] rounded-[32px] border-4 border-surface-dark bg-surface-dark p-1.5 shadow-2xl z-20 hidden xs:block">
          {/* Phone Screen */}
          <div className="rounded-[24px] bg-canvas overflow-hidden border border-white/10 p-3 space-y-2.5 text-left select-none">
            {/* Notch */}
            <div className="w-16 h-3 bg-surface-dark rounded-full mx-auto mb-1" />

            {/* Score Ring Highlight Card */}
            <div className="p-3 rounded-xl bg-surface-card border border-hairline-strong text-center space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Fitly AI Match</span>
              <ScoreRing score={98} size="sm" showLabel={false} />
              <div className="text-xs font-bold text-ink leading-tight">
                98% Match Score
              </div>
              <p className="text-[10px] text-body">
                Skills directly align with CairoFin's stack.
              </p>
            </div>

            {/* Quick Action Simulation */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[10px] text-emerald-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Tailored CV & Cover Letter Ready</span>
            </div>

            <button
              type="button"
              className="w-full h-8 rounded-md bg-black text-white text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Apply (2 Credits)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
