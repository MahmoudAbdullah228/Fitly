import React from 'react';
import Card from '../ui/Card.jsx';
import ScoreRing from '../ui/ScoreRing.jsx';
import Chip from '../ui/Chip.jsx';
import Button from '../ui/Button.jsx';
import { useAppState } from '../../hooks/useAppState.js';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  HelpCircle 
} from 'lucide-react';

export default function MatchAnalysis({
  job,
  onApplyClick,
}) {
  const { credits, candidate } = useAppState();

  const match = job.match || {};
  const score = job.matchScore ?? match.score ?? 85;
  const matchedSkills = match.matchedSkills || [];
  const missingSkills = match.missingSkills || [];
  const strengths = match.strengths || [];
  const gaps = match.gaps || [];
  const summary = match.summary || 'Strong candidate alignment identified based on skills and background.';

  return (
    <Card className="p-6 bg-surface-card border border-hairline-strong space-y-6">
      {/* Header with Title and Score Ring */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-hairline">
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="p-1 rounded bg-black text-white">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </span>
            <h3 className="text-base font-semibold text-ink tracking-tight">
              Fitly AI Match Analysis
            </h3>
          </div>
          <p className="text-sm text-body leading-relaxed max-w-xl">
            {summary}
          </p>
        </div>

        {/* Visual Score Ring */}
        <div className="shrink-0">
          <ScoreRing score={score} size="md" showLabel={true} />
        </div>
      </div>

      {/* Skills Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Matched Skills ({matchedSkills.length})</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Verified in your CV
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[40px] p-3 rounded-lg bg-emerald-50/40 border border-emerald-100">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, i) => (
                <Chip key={i} variant="matched" size="sm">
                  ✓ {skill}
                </Chip>
              ))
            ) : (
              <span className="text-xs text-muted">No direct skill matches detected.</span>
            )}
          </div>
        </div>

        {/* Missing / Gap Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-body-strong flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Missing from Profile ({missingSkills.length})</span>
            </span>
            <span className="text-[11px] font-mono text-muted bg-surface-strong px-2 py-0.5 rounded">
              Job Requirements
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[40px] p-3 rounded-lg bg-surface-strong/40 border border-hairline">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, i) => (
                <Chip key={i} variant="missing" size="sm">
                  + {skill}
                </Chip>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-medium">
                You satisfy all required skill filters!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Competitive Advantage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-3.5 rounded-lg bg-canvas-soft border border-hairline space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-ink" />
            <span>Profile Strengths for this Role</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-body">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 rounded-lg bg-canvas-soft border border-hairline space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ink" />
            <span>Improvement Opportunities</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-body">
            {gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to action footer */}
      <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-body text-center sm:text-left">
          <span>Fitly will tailor your CV keywords and draft a targeted cover letter for </span>
          <strong className="text-ink">{job.company}</strong>.
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-mono font-semibold text-ink">Cost: 2 Credits</span>
            <span className="block text-[11px] text-muted">Balance: {credits} credits</span>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onApplyClick && onApplyClick(job)}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Apply with Fitly (2cr)</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
