import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import ScoreRing from '../ui/ScoreRing.jsx';
import Chip from '../ui/Chip.jsx';
import Button from '../ui/Button.jsx';
import { useAppState } from '../../hooks/useAppState.js';
import { 
  Bookmark, 
  MapPin, 
  Briefcase, 
  Building2, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

export default function JobCard({
  job,
  onApplyClick,
  variant = 'default',
}) {
  const { toggleSaveJob, isJobSaved } = useAppState();
  const saved = isJobSaved(job.id);

  const matchScore = job.matchScore ?? job.match?.score ?? 85;
  const matchedSkills = job.match?.matchedSkills || (job.requiredSkills || []).slice(0, 3);

  // Source badge styling
  const sourceColors = {
    LinkedIn: 'source',
    Wuzzuf: 'source',
    Indeed: 'source',
    Bayt: 'source',
    Forasna: 'source',
  };

  return (
    <Card
      hover
      className="p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 group bg-surface-card"
    >
      <div className="space-y-4">
        {/* Top Header: Source, Location, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="source" size="sm">
              {job.source}
            </Badge>
            <span className="text-xs text-body font-mono">
              {job.workMode}
            </span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-body flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{job.location}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className={`p-1.5 rounded-md border transition-colors ${
              saved
                ? 'bg-ink text-white border-ink'
                : 'bg-canvas text-muted border-hairline hover:text-ink hover:border-hairline-strong'
            }`}
            aria-label={saved ? 'Remove saved job' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Title & Company */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <Link
              to={`/jobs/${job.id}`}
              className="font-semibold text-base sm:text-lg text-ink group-hover:text-ink/80 transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
            <div className="flex items-center gap-2 text-sm text-body">
              <span className="font-medium text-body-strong">{job.company}</span>
              {job.seniority && (
                <>
                  <span className="text-muted">•</span>
                  <span className="text-xs text-body">{job.seniority}</span>
                </>
              )}
            </div>
          </div>

          {/* Match Score Ring (Compact or standard) */}
          <div className="shrink-0 flex flex-col items-center">
            <ScoreRing score={matchScore} size="sm" showLabel={false} />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-body mt-0.5">
              Fit Score
            </span>
          </div>
        </div>

        {/* Salary & Experience */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body font-mono">
          {job.salaryRange && (
            <span className="font-semibold text-ink">
              {job.salaryRange}
            </span>
          )}
          <span>{job.yearsExperienceMin}+ yrs exp</span>
        </div>

        {/* Matched Skill Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {matchedSkills.slice(0, 3).map((skill, idx) => (
            <Chip key={idx} variant="matched" size="sm">
              ✓ {skill}
            </Chip>
          ))}
          {job.requiredSkills?.length > 3 && (
            <span className="text-[11px] text-muted self-center pl-1 font-mono">
              +{job.requiredSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Posted date & Details link */}
      <div className="pt-4 mt-4 border-t border-hairline flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3.5 h-3.5" />
          {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}
        </span>

        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job.id}`}>
            <Button size="sm" variant="secondary">
              View Fit & Analysis
            </Button>
          </Link>
          {onApplyClick && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onApplyClick(job)}
            >
              Apply (2cr)
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
