import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';
import MatchAnalysis from '../components/jobs/MatchAnalysis.jsx';
import ApplyModal from '../components/jobs/ApplyModal.jsx';
import CheckoutModal from '../components/credits/CheckoutModal.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import { calculateMatch } from '../services/aiService.js';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Building2, 
  Bookmark, 
  Clock, 
  Users, 
  Sparkles,
  CheckCircle2,
  Share2,
  ExternalLink 
} from 'lucide-react';
import { useToast } from '../components/ui/Toast.jsx';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allJobs, candidate, toggleSaveJob, isJobSaved, credits } = useAppState();
  const { showToast } = useToast();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);

  // Find job
  const job = useMemo(() => {
    return allJobs.find((j) => j.id === id);
  }, [allJobs, id]);

  // Compute live match analysis for this job & candidate
  const jobWithMatch = useMemo(() => {
    if (!job) return null;
    const match = calculateMatch(candidate, job);
    return {
      ...job,
      match,
      matchScore: match.score,
    };
  }, [job, candidate]);

  if (!jobWithMatch) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Job listing not found</h2>
        <p className="text-sm text-body">The requested position may have expired or does not exist.</p>
        <Link to="/matches">
          <Button variant="primary">Return to Matches Feed</Button>
        </Link>
      </div>
    );
  }

  const isSaved = isJobSaved(jobWithMatch.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="w-full bg-canvas py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Back Link Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-body hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Matches</span>
          </button>
        </div>

        {/* Job Header Hero Card */}
        <div className="p-6 sm:p-8 rounded-xl bg-surface-card border border-hairline-strong shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="source" size="sm">{jobWithMatch.source}</Badge>
                <span className="text-xs font-mono text-body">{jobWithMatch.workMode}</span>
                <span className="text-xs text-muted">•</span>
                <span className="text-xs font-mono text-body">{jobWithMatch.employmentType}</span>
                {jobWithMatch.seniority && (
                  <>
                    <span className="text-muted">•</span>
                    <span className="text-xs text-body">{jobWithMatch.seniority}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                {jobWithMatch.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-body">
                <span className="font-semibold text-body-strong flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-muted" />
                  {jobWithMatch.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted" />
                  {jobWithMatch.location}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {jobWithMatch.postedDaysAgo === 0 ? 'Today' : `${jobWithMatch.postedDaysAgo} days ago`}
                </span>
              </div>

              {jobWithMatch.salaryRange && (
                <div className="pt-2">
                  <span className="text-base font-bold font-mono text-ink">
                    {jobWithMatch.salaryRange}
                  </span>
                </div>
              )}
            </div>

            {/* Match score summary box on header */}
            <div className="flex sm:flex-col items-center justify-between sm:justify-center p-4 rounded-xl bg-canvas-soft border border-hairline-strong gap-3 shrink-0">
              <ScoreRing score={jobWithMatch.matchScore} size="md" showLabel={true} />
              <div className="text-center">
                <span className="text-xs font-mono text-muted block">
                  {jobWithMatch.applicantsCount} Applicants
                </span>
              </div>
            </div>

          </div>

          {/* Action buttons header */}
          <div className="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleSaveJob(jobWithMatch.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors ${
                  isSaved
                    ? 'bg-ink text-white border-ink'
                    : 'bg-white text-ink border-hairline-strong hover:bg-canvas-soft'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                <span>{isSaved ? 'Saved to Bookmarks' : 'Save Job'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-hairline-strong bg-white text-xs font-medium text-ink hover:bg-canvas-soft transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-muted" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-bold text-ink block">Cost: 2 Credits</span>
                <span className="text-[11px] text-muted block">Balance: {credits} credits</span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setApplyModalOpen(true)}
              >
                <Sparkles className="w-4 h-4 mr-1.5 fill-white stroke-none" />
                <span>Apply with Fitly (2cr)</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Main Details on Left, Match Analysis on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Description Column (2 cols wide) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Job Description */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-ink tracking-tight">
                About the Role
              </h2>
              <p className="text-sm text-body leading-relaxed whitespace-pre-line">
                {jobWithMatch.description}
              </p>
            </section>

            {/* Responsibilities */}
            {jobWithMatch.responsibilities?.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-ink tracking-tight">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2 text-sm text-body">
                  {jobWithMatch.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Required Skills & Qualifications */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-ink tracking-tight">
                Required Qualifications & Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {jobWithMatch.requiredSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-md font-medium bg-surface-strong text-ink border border-hairline"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {jobWithMatch.niceToHaveSkills?.length > 0 && (
                <div className="pt-2 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Nice-to-Have Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jobWithMatch.niceToHaveSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-md font-medium bg-canvas-soft text-body border border-hairline"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-body font-mono">
                <span>Minimum Experience: <strong>{jobWithMatch.yearsExperienceMin}+ years</strong></span>
                <span className="mx-2">•</span>
                <span>Education: {jobWithMatch.educationRequirement}</span>
              </div>
            </section>

            {/* Benefits & Perks */}
            {jobWithMatch.benefits?.length > 0 && (
              <section className="space-y-3 pt-4 border-t border-hairline">
                <h2 className="text-lg font-semibold text-ink tracking-tight">
                  Perks & Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {jobWithMatch.benefits.map((ben, i) => (
                    <div key={i} className="p-3 rounded-lg bg-canvas-soft border border-hairline text-xs text-body flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column: Sticky Fitly AI Match Analysis Panel */}
          <div className="space-y-6">
            <div className="sticky top-20">
              <MatchAnalysis
                job={jobWithMatch}
                onApplyClick={() => setApplyModalOpen(true)}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          job={jobWithMatch}
          onOpenCheckout={(pack) => {
            setApplyModalOpen(false);
            setCheckoutItem(pack);
          }}
        />
      )}

      {/* Checkout Modal */}
      {checkoutItem && (
        <CheckoutModal
          isOpen={Boolean(checkoutItem)}
          onClose={() => setCheckoutItem(null)}
          selectedItem={checkoutItem}
        />
      )}
    </div>
  );
}
