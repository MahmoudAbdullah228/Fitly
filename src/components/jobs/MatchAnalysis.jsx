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
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-hairline">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-black text-white shrink-0">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </span>
            <h3 className="text-sm font-semibold text-ink tracking-tight">
              Fitly AI Match Analysis
            </h3>
          </div>
          <p className="text-xs text-body leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Visual Score Ring */}
        <div className="shrink-0 pt-0.5">
          <ScoreRing score={score} size="sm" showLabel={true} />
        </div>
      </div>

      {/* Skills Comparison Sections */}
      <div className="space-y-4">
        
        {/* Matched Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Matched Skills ({matchedSkills.length})</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified in CV
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
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-body-strong flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Missing from Profile ({missingSkills.length})</span>
            </span>
            <span className="text-[10px] font-mono text-muted bg-surface-strong px-2 py-0.5 rounded border border-hairline">
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
      <div className="space-y-3 pt-1">
        <div className="p-3.5 rounded-lg bg-canvas-soft border border-hairline space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-ink shrink-0" />
            <span>Profile Strengths</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-body">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {gaps.length > 0 && (
          <div className="p-3.5 rounded-lg bg-canvas-soft border border-hairline space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-ink shrink-0" />
              <span>Improvement Opportunities</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-body">
              {gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-600 font-bold shrink-0">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Call to action footer */}
      <div className="pt-4 border-t border-hairline space-y-3">
        <div className="text-xs text-body">
          <span>Fitly will tailor your CV keywords and draft a targeted cover letter for </span>
          <strong className="text-ink">{job.company}</strong>.
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs font-mono">
            <span className="font-semibold text-ink">Cost: 2 Credits</span>
            <span className="text-muted ml-2">(Balance: {credits})</span>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto justify-center"
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
