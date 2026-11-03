import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import demoCandidates from '../data/candidates.json' with { type: 'json' };
import allJobsData from '../data/jobs.json' with { type: 'json' };
import { calculateMatch, getTopMatches } from '../services/aiService.js';

const AppStateContext = createContext(null);

const STORAGE_KEY = 'fitly_state_v1';

const INITIAL_CREDITS = 4; // Exactly 2 full applications (2 credits each)

export function AppStateProvider({ children }) {
  // Load initial state from localStorage or initialize defaults
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage:', e);
    }

    // Default pristine state
    return {
      candidate: demoCandidates[0], // Omar Tarek as default active profile
      credits: INITIAL_CREDITS,
      savedJobIds: [],
      applications: [],
      currentPlan: null, // null or { planId, billingCycle, activatedAt }
      usageHistory: [
        {
          id: 'tx-welcome',
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'credit',
          description: 'Starter credits bonus (2 free applications)',
          amount: INITIAL_CREDITS,
          balanceAfter: INITIAL_CREDITS,
        },
      ],
      isOnboarded: true,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [state]);

  // Set candidate profile (e.g. after onboarding or profile edit)
  const setCandidate = useCallback((candidate) => {
    setState((prev) => ({
      ...prev,
      candidate,
      isOnboarded: true,
    }));
  }, []);

  // Update candidate profile fields
  const updateCandidate = useCallback((updatedFields) => {
    setState((prev) => ({
      ...prev,
      candidate: {
        ...prev.candidate,
        ...updatedFields,
      },
    }));
  }, []);

  // Deduct credits with transaction record
  const deductCredits = useCallback((amount, description) => {
    let success = false;
    setState((prev) => {
      if (prev.credits < amount) {
        success = false;
        return prev;
      }
      success = true;
      const newBalance = prev.credits - amount;
      const tx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'debit',
        description,
        amount: -amount,
        balanceAfter: newBalance,
      };
      return {
        ...prev,
        credits: newBalance,
        usageHistory: [tx, ...prev.usageHistory],
      };
    });
    return success;
  }, []);

  // Add credits (e.g. after purchasing a pack)
  const addCredits = useCallback((amount, description) => {
    setState((prev) => {
      const newBalance = prev.credits + amount;
      const tx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'credit',
        description,
        amount: +amount,
        balanceAfter: newBalance,
      };
      return {
        ...prev,
        credits: newBalance,
        usageHistory: [tx, ...prev.usageHistory],
      };
    });
  }, []);

  // Activate subscription plan
  const activatePlan = useCallback((plan, billingCycle = 'monthly') => {
    const creditsToAdd = plan.monthlyCredits || 16;
    setState((prev) => {
      const newBalance = prev.credits + creditsToAdd;
      const tx = {
        id: `tx-plan-${Date.now()}`,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'credit',
        description: `Subscribed to ${plan.name} Plan (${billingCycle})`,
        amount: +creditsToAdd,
        balanceAfter: newBalance,
      };
      return {
        ...prev,
        credits: newBalance,
        currentPlan: {
          planId: plan.id,
          name: plan.name,
          billingCycle,
          priceEgp: billingCycle === 'yearly' ? plan.yearlyPriceEgp : plan.monthlyPriceEgp,
          activatedAt: new Date().toISOString(),
        },
        usageHistory: [tx, ...prev.usageHistory],
      };
    });
  }, []);

  // Toggle saving a job
  const toggleSaveJob = useCallback((jobId) => {
    setState((prev) => {
      const isSaved = prev.savedJobIds.includes(jobId);
      return {
        ...prev,
        savedJobIds: isSaved
          ? prev.savedJobIds.filter((id) => id !== jobId)
          : [...prev.savedJobIds, jobId],
      };
    });
  }, []);

  // Check if job is saved
  const isJobSaved = useCallback(
    (jobId) => {
      return state.savedJobIds.includes(jobId);
    },
    [state.savedJobIds]
  );

  // Record a completed job application
  const addApplication = useCallback((applicationData) => {
    setState((prev) => {
      const newApp = {
        id: `app-${Date.now()}`,
        appliedAt: new Date().toISOString(),
        status: 'Applied', // Default status: 'Applied'
        ...applicationData,
      };
      return {
        ...prev,
        applications: [newApp, ...prev.applications],
      };
    });
  }, []);

  // Update status of an application ('Applied', 'Interviewing', 'Offer', 'Rejected')
  const updateApplicationStatus = useCallback((applicationId, newStatus) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ),
    }));
  }, []);

  // Reset entire demo back to factory initial state
  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }

    setState({
      candidate: demoCandidates[0],
      credits: INITIAL_CREDITS,
      savedJobIds: [],
      applications: [],
      currentPlan: null,
      usageHistory: [
        {
          id: `tx-reset-${Date.now()}`,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'credit',
          description: 'Demo reset — Starter credits bonus (2 free applications)',
          amount: INITIAL_CREDITS,
          balanceAfter: INITIAL_CREDITS,
        },
      ],
      isOnboarded: true,
    });
  }, []);

  const value = {
    candidate: state.candidate,
    credits: state.credits,
    savedJobIds: state.savedJobIds,
    applications: state.applications,
    currentPlan: state.currentPlan,
    usageHistory: state.usageHistory,
    isOnboarded: state.isOnboarded,
    allJobs: allJobsData,
    setCandidate,
    updateCandidate,
    deductCredits,
    addCredits,
    activatePlan,
    toggleSaveJob,
    isJobSaved,
    addApplication,
    updateApplicationStatus,
    resetDemo,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
