import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from '../../hooks/useAppState.js';
import { 
  Sparkles, 
  Bookmark, 
  FileText, 
  Briefcase, 
  User, 
  Menu, 
  X,
  Plus
} from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function Navbar({ onOpenCheckout }) {
  const { credits, savedJobIds, applications, candidate } = useAppState();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Matches', path: '/matches', icon: Briefcase },
    { 
      name: 'Applications', 
      path: '/applications', 
      icon: FileText, 
      count: applications.length > 0 ? applications.length : null 
    },
    { 
      name: 'Saved', 
      path: '/saved', 
      icon: Bookmark, 
      count: savedJobIds.length > 0 ? savedJobIds.length : null 
    },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-hairline">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-on-primary font-bold text-sm tracking-tight group-hover:bg-primary-active transition-colors">
              F
            </span>
            <span className="font-semibold text-lg tracking-tight text-ink">
              Fitly
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-surface-strong text-ink font-semibold'
                      : 'text-body hover:text-ink hover:bg-canvas-soft'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{link.name}</span>
                  {link.count !== null && (
                    <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-mono bg-surface-strong text-ink border border-hairline">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Live Credits Balance Chip & Action */}
        <div className="flex items-center gap-3">
          {/* Live Credit Chip */}
          <Link
            to="/credits"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-hairline-strong bg-canvas-soft hover:bg-surface-strong transition-all group"
            title="View credits & billing plans"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800">
              <Sparkles className="w-3 h-3 fill-emerald-600 stroke-none" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-semibold text-sm text-ink">
                {credits}
              </span>
              <span className="text-xs text-body hidden sm:inline">
                {credits === 1 ? 'Credit' : 'Credits'}
              </span>
            </div>
            <div className="pl-1 border-l border-hairline-strong text-muted group-hover:text-ink">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Get Started / Onboard Quick Link */}
          <Link to="/start" className="hidden sm:inline-flex">
            <Button size="sm" variant="secondary">
              Upload CV
            </Button>
          </Link>

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-body hover:text-ink hover:bg-surface-strong transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-hairline-strong bg-canvas px-4 pt-2 pb-5 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-surface-strong text-ink font-semibold'
                    : 'text-body hover:bg-canvas-soft hover:text-ink'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{link.name}</span>
                </div>
                {link.count !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-surface-strong text-ink border border-hairline">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-hairline flex flex-col gap-2">
            <Link
              to="/credits"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-body hover:text-ink"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Credit Balance & Plans</span>
              </span>
              <span className="font-mono font-semibold text-ink">{credits} credits</span>
            </Link>
            <Link
              to="/start"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button size="md" variant="primary" className="w-full">
                Upload New CV / Onboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
