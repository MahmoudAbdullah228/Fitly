import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../hooks/useAppState.js';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useToast } from '../ui/Toast.jsx';

export default function Footer() {
  const { resetDemo } = useAppState();
  const { showToast } = useToast();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleConfirmReset = () => {
    resetDemo();
    setShowResetModal(false);
    showToast('Demo data reset successfully. Initial 4 credits restored.', 'success');
  };

  return (
    <footer className="w-full bg-canvas border-t border-hairline mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-hairline">
          
          {/* Col 1: Brand & Tagline */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                F
              </span>
              <span className="font-semibold text-base tracking-tight text-ink">
                Fitly
              </span>
            </div>
            <p className="text-sm text-body max-w-sm mb-4 leading-relaxed">
              Apply where you fit. AI-powered job matching platform built for Egypt and MENA candidates.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Frontend Prototype v1.0 • Cairo, Egypt</span>
            </div>
          </div>

          {/* Col 2: Job Seeker */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-body">
              <li>
                <Link to="/matches" className="hover:text-ink transition-colors">
                  Top 10 Matches
                </Link>
              </li>
              <li>
                <Link to="/start" className="hover:text-ink transition-colors">
                  Upload CV & Extract
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-ink transition-colors">
                  Applications Tracker
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-ink transition-colors">
                  Saved Job Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pricing & Credits */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-3">
              Credits & Plans
            </h4>
            <ul className="space-y-2 text-sm text-body">
              <li>
                <Link to="/credits" className="hover:text-ink transition-colors">
                  Credit Packs (EGP)
                </Link>
              </li>
              <li>
                <Link to="/credits" className="hover:text-ink transition-colors">
                  Monthly Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/credits" className="hover:text-ink transition-colors">
                  Usage History
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-ink transition-colors">
                  Candidate Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Demo Utilities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-3">
              Demo Controls
            </h4>
            <ul className="space-y-2 text-sm text-body">
              <li>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-body hover:text-red-600 transition-colors py-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo State</span>
                </button>
              </li>
              <li>
                <span className="text-xs text-muted block pt-1">
                  Re-arms 4 starter credits and clears applied records.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-body">
          <p>© {new Date().getFullYear()} Fitly Technologies. All simulated job listings are fictional.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-muted">
              Design System: Expo-Neutral (DESIGN.md)
            </span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Prototype State?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              This will reset your local credit balance back to <strong>4 credits</strong>, wipe application history, reset saved jobs, and restore the initial demo candidate profile.
            </div>
          </div>
          <p className="text-sm text-body">
            Use this action between demo presentations to test the fresh user flow from scratch.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmReset}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </footer>
  );
}
