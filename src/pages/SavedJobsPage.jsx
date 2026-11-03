import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';
import JobCard from '../components/jobs/JobCard.jsx';
import ApplyModal from '../components/jobs/ApplyModal.jsx';
import CheckoutModal from '../components/credits/CheckoutModal.jsx';
import Button from '../components/ui/Button.jsx';
import { calculateMatch } from '../services/aiService.js';
import { Bookmark, ArrowRight, Sparkles } from 'lucide-react';

export default function SavedJobsPage() {
  const { savedJobIds, allJobs, candidate } = useAppState();

  const [applyingJob, setApplyingJob] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);

  // Filter saved jobs and calculate live match scores
  const savedJobs = allJobs
    .filter((j) => savedJobIds.includes(j.id))
    .map((j) => {
      const match = calculateMatch(candidate, j);
      return {
        ...j,
        match,
        matchScore: match.score,
      };
    });

  return (
    <div className="w-full bg-canvas py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink flex items-center gap-2">
              <Bookmark className="w-6 h-6 fill-black" />
              <span>Saved Job Listings ({savedJobs.length})</span>
            </h1>
            <p className="text-sm text-body">
              Your bookmarked opportunities with real-time match analysis for {candidate.name}.
            </p>
          </div>

          <Link to="/matches">
            <Button size="sm" variant="secondary">
              Browse All Matches
            </Button>
          </Link>
        </div>

        {/* Saved Jobs Grid */}
        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={(targetJob) => setApplyingJob(targetJob)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-16 rounded-xl border border-hairline-strong bg-surface-card text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center mx-auto text-muted">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">
                No bookmarked jobs yet
              </h3>
              <p className="text-xs text-body">
                Click the bookmark icon on any job card in your feed to save it here for later.
              </p>
            </div>
            <Link to="/matches">
              <Button size="sm" variant="primary">
                Explore Top 10 Matches
              </Button>
            </Link>
          </div>
        )}

      </div>

      {/* Apply Modal */}
      {applyingJob && (
        <ApplyModal
          isOpen={Boolean(applyingJob)}
          onClose={() => setApplyingJob(null)}
          job={applyingJob}
          onOpenCheckout={(pack) => {
            setApplyingJob(null);
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
