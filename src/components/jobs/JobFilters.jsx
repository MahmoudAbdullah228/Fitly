import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function JobFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  onClearFilters,
  totalResults = 0,
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    filters.workMode !== 'all' ||
    filters.location !== 'all' ||
    filters.seniority !== 'all' ||
    filters.source !== 'all' ||
    filters.minScore > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by job title, company, or tech skill (e.g. React, Node, Python)..."
            className="h-11 w-full rounded-md border border-hairline-strong bg-surface-card pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-muted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-11 rounded-md border border-hairline-strong bg-surface-card px-3.5 py-2 text-xs font-semibold text-ink focus:border-ink focus:outline-none cursor-pointer appearance-none pr-8"
            >
              <option value="score">Sort: Highest Match</option>
              <option value="newest">Sort: Newest Posted</option>
              <option value="applicants">Sort: Least Competition</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-muted absolute right-3 top-4 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden h-11 px-3.5 rounded-md border border-hairline-strong bg-surface-card text-ink flex items-center gap-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Options Bar (Desktop or toggled mobile) */}
      <div
        className={`flex flex-wrap items-center gap-2.5 pt-1 ${
          mobileFiltersOpen ? 'flex' : 'hidden sm:flex'
        }`}
      >
        {/* Work Mode */}
        <select
          value={filters.workMode}
          onChange={(e) => onFilterChange('workMode', e.target.value)}
          className="h-9 rounded-md border border-hairline bg-surface-card px-3 text-xs text-ink focus:border-ink focus:outline-none cursor-pointer"
        >
          <option value="all">Work Mode: All</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        {/* Location */}
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="h-9 rounded-md border border-hairline bg-surface-card px-3 text-xs text-ink focus:border-ink focus:outline-none cursor-pointer"
        >
          <option value="all">Location: All Cities</option>
          <option value="Cairo">Cairo</option>
          <option value="Giza">Giza</option>
          <option value="New Cairo">New Cairo</option>
          <option value="6th of October">6th of October</option>
          <option value="Alexandria">Alexandria</option>
          <option value="Mansoura">Mansoura</option>
        </select>

        {/* Seniority */}
        <select
          value={filters.seniority}
          onChange={(e) => onFilterChange('seniority', e.target.value)}
          className="h-9 rounded-md border border-hairline bg-surface-card px-3 text-xs text-ink focus:border-ink focus:outline-none cursor-pointer"
        >
          <option value="all">Seniority: All Levels</option>
          <option value="Junior">Junior (0-2 yrs)</option>
          <option value="Mid-Level">Mid-Level (2-4 yrs)</option>
          <option value="Senior">Senior (4+ yrs)</option>
          <option value="Lead">Lead / Management</option>
        </select>

        {/* Job Board Source */}
        <select
          value={filters.source}
          onChange={(e) => onFilterChange('source', e.target.value)}
          className="h-9 rounded-md border border-hairline bg-surface-card px-3 text-xs text-ink focus:border-ink focus:outline-none cursor-pointer"
        >
          <option value="all">Source: All Boards</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Wuzzuf">Wuzzuf</option>
          <option value="Indeed">Indeed</option>
          <option value="Bayt">Bayt</option>
          <option value="Forasna">Forasna</option>
        </select>

        {/* Minimum Match % */}
        <select
          value={filters.minScore}
          onChange={(e) => onFilterChange('minScore', Number(e.target.value))}
          className="h-9 rounded-md border border-hairline bg-surface-card px-3 text-xs text-ink focus:border-ink focus:outline-none cursor-pointer font-mono"
        >
          <option value="0">Min Match: Any</option>
          <option value="80">≥ 80% (Great Fit)</option>
          <option value="70">≥ 70% (Solid Fit)</option>
          <option value="60">≥ 60% (Moderate)</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="h-9 px-2.5 rounded-md text-xs text-body hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}

        <div className="ml-auto text-xs font-mono text-muted">
          Showing {totalResults} {totalResults === 1 ? 'role' : 'roles'}
        </div>
      </div>
    </div>
  );
}
