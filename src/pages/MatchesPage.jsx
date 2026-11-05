import React, { useState, useMemo, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState.js';
import JobCard from '../components/jobs/JobCard.jsx';
import JobFilters from '../components/jobs/JobFilters.jsx';
import ApplyModal from '../components/jobs/ApplyModal.jsx';
import CheckoutModal from '../components/credits/CheckoutModal.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import { Skeleton, JobCardSkeleton } from '../components/ui/Skeleton.jsx';
import Button from '../components/ui/Button.jsx';
import { getTopMatches } from '../services/aiService.js';
import { 
  Sparkles, 
  Briefcase, 
  Layers, 
  FilterX, 
  ArrowRight,
  TrendingUp,
  UserCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MatchesPage() {
  const { candidate, allJobs, credits } = useAppState();

  const [activeTab, setActiveTab] = useState('top10'); // 'top10' | 'all'
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    workMode: 'all',
    location: 'all',
    seniority: 'all',
    source: 'all',
    minScore: 0,
  });
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'newest' | 'applicants'

  // Apply & Checkout Modals
  const [applyingJob, setApplyingJob] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);

  // Simulate initial matching calculation animation (600ms)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [candidate?.id]);

  // Compute matched jobs for active candidate
  const evaluatedJobs = useMemo(() => {
    return getTopMatches(candidate, allJobs, null); // all evaluated
  }, [candidate, allJobs]);

  // Separate Top 10 vs All
  const basePool = useMemo(() => {
    if (activeTab === 'top10') {
      return evaluatedJobs.slice(0, 10);
    }
    return evaluatedJobs;
  }, [activeTab, evaluatedJobs]);

  // Apply live user filters, search, and sorting
  const filteredJobs = useMemo(() => {
    let list = [...basePool];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((j) => {
        const inTitle = j.title.toLowerCase().includes(q);
        const inCompany = j.company.toLowerCase().includes(q);
        const inSkills = (j.requiredSkills || []).some((s) => s.toLowerCase().includes(q));
        return inTitle || inCompany || inSkills;
      });
    }

    // Work Mode filter
    if (filters.workMode !== 'all') {
      list = list.filter((j) => j.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }

    // Location filter
    if (filters.location !== 'all') {
      list = list.filter((j) => j.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Seniority filter
    if (filters.seniority !== 'all') {
      list = list.filter((j) => j.seniority?.toLowerCase() === filters.seniority.toLowerCase());
    }

    // Source filter
    if (filters.source !== 'all') {
      list = list.filter((j) => j.source.toLowerCase() === filters.source.toLowerCase());
    }

    // Minimum match score
    if (filters.minScore > 0) {
      list = list.filter((j) => (j.matchScore ?? j.match?.score ?? 0) >= filters.minScore);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'score') {
        const sA = a.matchScore ?? a.match?.score ?? 0;
        const sB = b.matchScore ?? b.match?.score ?? 0;
        return sB - sA;
      } else if (sortBy === 'newest') {
        return (a.postedDaysAgo || 0) - (b.postedDaysAgo || 0);
      } else if (sortBy === 'applicants') {
        return (a.applicantsCount || 0) - (b.applicantsCount || 0);
      }
      return 0;
    });

    return list;
  }, [basePool, searchQuery, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      workMode: 'all',
      location: 'all',
      seniority: 'all',
      source: 'all',
      minScore: 0,
    });
    setSortBy('score');
  };

  return (
    <div className="w-full bg-canvas py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-black text-white">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                Job Matches Dashboard
              </h1>
            </div>
            <p className="text-sm text-body">
              Targeted roles ranked by skill overlap for <strong>{candidate.name}</strong> ({candidate.role}).
            </p>
          </div>

          {/* Candidate profile actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Link to="/profile" className="w-full sm:w-auto">
              <Button size="sm" variant="secondary" className="w-full sm:w-auto justify-center">
                <UserCheck className="w-3.5 h-3.5 mr-1 text-muted" />
                <span>Edit Profile Skills</span>
              </Button>
            </Link>
            <Link to="/start" className="w-full sm:w-auto">
              <Button size="sm" variant="ghost" className="w-full sm:w-auto justify-center">
                Upload New CV
              </Button>
            </Link>
          </div>
        </div>

        {/* View Switcher Tabs (Top 10 vs Browse All) */}
        <div className="flex items-center justify-between">
          <Tabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              handleClearFilters();
            }}
            tabs={[
              { id: 'top10', label: 'Your Top 10 Matches', icon: Sparkles, badge: '10' },
              { id: 'all', label: 'Browse Full Market Feed', icon: Briefcase, badge: evaluatedJobs.length },
            ]}
          />
        </div>

        {/* Search, Filter & Sort Controls */}
        <JobFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          totalResults={filteredJobs.length}
        />

        {/* Job Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={(targetJob) => setApplyingJob(targetJob)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="p-12 rounded-xl border border-hairline-strong bg-surface-card text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center mx-auto text-muted">
              <FilterX className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">
                No matching jobs found
              </h3>
              <p className="text-xs text-body">
                Try loosening your filters or search terms to see more available listings.
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
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
