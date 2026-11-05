import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Tabs from '../ui/Tabs.jsx';
import Badge from '../ui/Badge.jsx';
import ScoreRing from '../ui/ScoreRing.jsx';
import { useAppState } from '../../hooks/useAppState.js';
import { useToast } from '../ui/Toast.jsx';
import { 
  generateTailoredCv, 
  generateCoverLetter 
} from '../../services/aiService.js';
import { 
  Sparkles, 
  FileText, 
  Mail, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  RefreshCw,
  Printer
} from 'lucide-react';

export default function ApplyModal({
  isOpen,
  onClose,
  job,
  onOpenCheckout,
}) {
  const { credits, candidate, deductCredits, addApplication } = useAppState();
  const { showToast } = useToast();

  const [step, setStep] = useState('confirm'); // 'confirm' | 'generating' | 'result'
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' | 'letter'
  const [selectedTone, setSelectedTone] = useState('professional');

  const [progressState, setProgressState] = useState({ message: '', progress: 0 });
  const [tailoredCv, setTailoredCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  // Editable CV fields
  const [editableSummary, setEditableSummary] = useState('');
  const [editableLetterContent, setEditableLetterContent] = useState('');
  const [copiedCv, setCopiedCv] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setActiveTab('cv');
      setSelectedTone('professional');
      setTailoredCv(null);
      setCoverLetter(null);
    }
  }, [isOpen, job?.id]);

  if (!isOpen || !job) return null;

  const cost = 2; // 2 credits for full application
  const hasEnoughCredits = credits >= cost;

  // Handle starting application generation
  const handleStartApply = async () => {
    if (!hasEnoughCredits) return;

    // Deduct credits
    const success = deductCredits(cost, `Applied to ${job.title} at ${job.company} (CV + Cover Letter)`);
    if (!success) {
      showToast('Insufficient credits balance.', 'error');
      return;
    }

    setStep('generating');

    try {
      // 1. Generate tailored CV
      const cvResult = await generateTailoredCv(candidate, job, (p) => {
        setProgressState({ message: p.message, progress: Math.round(p.progress * 0.6) });
      });

      // 2. Generate cover letter
      const letterResult = await generateCoverLetter(candidate, job, selectedTone, (p) => {
        setProgressState({ message: p.message, progress: 60 + Math.round(p.progress * 0.4) });
      });

      setTailoredCv(cvResult);
      setEditableSummary(cvResult.summary);
      setCoverLetter(letterResult);
      setEditableLetterContent(letterResult.content);

      setStep('result');
      showToast('Tailored CV and Cover Letter generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating application documents.', 'error');
      setStep('confirm');
    }
  };

  // Tone switch for cover letter
  const handleToneChange = async (newTone) => {
    setSelectedTone(newTone);
    try {
      const updatedLetter = await generateCoverLetter(candidate, job, newTone);
      setCoverLetter(updatedLetter);
      setEditableLetterContent(updatedLetter.content);
    } catch (err) {
      console.error(err);
    }
  };

  // Download CV as PDF using print stylesheet
  const handlePrintCv = () => {
    window.print();
  };

  // Download Cover Letter as .txt
  const handleDownloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([editableLetterContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${candidate.name.replace(/\s+/g, '_')}_Cover_Letter_${job.company.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Cover letter downloaded as .txt', 'info');
  };

  // Copy helpers
  const handleCopyCv = () => {
    if (!tailoredCv) return;
    const text = `${candidate.name}\n${candidate.headline}\n${candidate.email} | ${candidate.phone} | ${candidate.location}\n\nSUMMARY\n${editableSummary}\n\nSKILLS\n${tailoredCv.skills.map((s) => s.name).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedCv(true);
    setTimeout(() => setCopiedCv(false), 2000);
    showToast('CV text copied to clipboard', 'info');
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(editableLetterContent);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
    showToast('Cover letter text copied to clipboard', 'info');
  };

  // Mark as applied action
  const handleMarkAsApplied = () => {
    setIsSubmittingApp(true);
    addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyId: job.companyId,
      location: job.location,
      source: job.source,
      matchScore: job.matchScore || job.match?.score || 85,
      tailoredCv: {
        ...tailoredCv,
        summary: editableSummary,
      },
      coverLetter: {
        ...coverLetter,
        content: editableLetterContent,
      },
    });

    showToast(`Application saved to tracker for ${job.company}!`, 'success');
    setIsSubmittingApp(false);
    onClose();
  };

  // Simulated open original posting
  const handleOpenOriginalPosting = () => {
    showToast(`Simulated: Opening job posting directly on ${job.source}...`, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'confirm'
          ? 'Apply with Fitly'
          : step === 'generating'
          ? 'Generating Application Materials'
          : `Tailored Application for ${job.company}`
      }
      description={
        step === 'confirm'
          ? `${job.title} • ${job.location}`
          : step === 'generating'
          ? 'Fitly AI is customizing your documents for maximum ATS alignment...'
          : `Targeted for ${job.title} (${job.source})`
      }
      maxWidth={step === 'result' ? 'max-w-4xl' : 'max-w-lg'}
      preventClose={step === 'generating'}
    >
      {/* 1. CONFIRMATION STEP */}
      {step === 'confirm' && (
        <div className="space-y-6">
          {/* Insufficient credits warning */}
          {!hasEnoughCredits ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Insufficient AI Credits</h4>
                  <p className="text-xs leading-relaxed">
                    You currently have <strong>{credits} credits</strong>, but generating a tailored CV and targeted cover letter requires <strong>{cost} credits</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-card border border-hairline-strong flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-ink">Active Seeker Pack (16 Credits)</h4>
                  <p className="text-xs text-body">Instant top-up for 8 full applications</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    if (onOpenCheckout) {
                      onOpenCheckout({
                        type: 'pack',
                        title: 'Active Seeker Pack',
                        credits: 16,
                        priceEgp: 399,
                      });
                    }
                  }}
                >
                  Buy for 399 EGP
                </Button>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Sufficient credits -> Confirm application cost
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-canvas-soft border border-hairline-strong space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body">Tailored ATS-Optimized CV</span>
                  <span className="font-mono text-sm font-semibold text-ink">1 Credit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body">Personalized Target Cover Letter</span>
                  <span className="font-mono text-sm font-semibold text-ink">1 Credit</span>
                </div>
                <div className="pt-2 border-t border-hairline flex items-center justify-between font-medium text-sm">
                  <span className="text-ink font-semibold">Total Application Cost</span>
                  <span className="font-mono font-bold text-ink">2 Credits</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your balance: <strong>{credits} credits</strong> → Remaining after apply: <strong>{credits - cost} credits</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-hairline">
                <Button variant="secondary" className="w-full sm:w-auto" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" className="w-full sm:w-auto justify-center" onClick={handleStartApply}>
                  Generate Application (2 Credits)
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. GENERATING LOADING STEP */}
      {step === 'generating' && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-200">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-canvas-soft border-2 border-hairline-strong flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-ink animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-semibold text-base text-ink">
              Crafting Tailored Materials
            </h3>
            <p className="text-sm text-body min-h-[40px] transition-all">
              {progressState.message || 'Analyzing job listing keywords...'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs bg-surface-strong h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressState.progress}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted">
            {progressState.progress}% completed
          </span>
        </div>
      )}

      {/* 3. RESULT WORKSPACE STEP */}
      {step === 'result' && tailoredCv && (
        <div className="space-y-5">
          {/* Top workspace tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-2">
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: 'cv', label: 'Tailored ATS CV', icon: FileText, badge: `${tailoredCv.atsScore}% ATS Fit` },
                { id: 'letter', label: 'Targeted Cover Letter', icon: Mail },
              ]}
            />

            {/* Quick action bar */}
            <div className="flex items-center gap-2">
              {activeTab === 'cv' ? (
                <>
                  <Button size="sm" variant="secondary" onClick={handleCopyCv}>
                    {copiedCv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCv ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button size="sm" variant="primary" onClick={handlePrintCv}>
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    <span>Download PDF</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="secondary" onClick={handleCopyLetter}>
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <Button size="sm" variant="primary" onClick={handleDownloadLetter}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    <span>Download .txt</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* TAB 1: TAILORED CV */}
          {activeTab === 'cv' && (
            <div className="space-y-6">
              {/* Diff highlights notification banner */}
              <div className="p-3.5 rounded-lg bg-surface-strong border border-hairline text-xs space-y-2">
                <div className="font-semibold text-ink flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Tailoring Summary (What Changed):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body">
                  {tailoredCv.diffHighlights?.map((diff, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>
                        <strong>{diff.section}:</strong> {diff.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview Container (Print Friendly Single-Column ATS Layout) */}
              <div
                id="printable-cv"
                className="bg-white border border-hairline-strong rounded-lg p-6 sm:p-8 font-sans text-ink space-y-6 shadow-xs max-h-[480px] overflow-y-auto"
              >
                {/* CV Header */}
                <div className="border-b border-hairline-strong pb-4 text-center">
                  <h1 className="text-2xl font-bold tracking-tight text-black">
                    {candidate.name}
                  </h1>
                  <p className="text-sm font-medium text-body mt-0.5">
                    {job.title} Applicant
                  </p>
                  <p className="text-xs text-body font-mono mt-2">
                    {candidate.email} • {candidate.phone} • {candidate.location}
                  </p>
                </div>

                {/* CV Professional Summary (Inline editable) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 inline-block">
                      Professional Summary
                    </h2>
                    <span className="text-[10px] text-muted">Click below to edit text directly</span>
                  </div>
                  <textarea
                    rows={3}
                    value={editableSummary}
                    onChange={(e) => setEditableSummary(e.target.value)}
                    className="w-full text-xs text-body leading-relaxed p-2 rounded border border-hairline hover:border-hairline-strong focus:border-ink focus:outline-none bg-canvas-soft/50"
                  />
                </div>

                {/* CV Skills Section */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 inline-block">
                    Technical & Core Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {tailoredCv.skills?.map((skill, i) => {
                      const isMatched = (job.requiredSkills || []).some(
                        (r) => r.toLowerCase() === skill.name.toLowerCase()
                      );
                      return (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded border ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                              : 'bg-white text-body border-hairline'
                          }`}
                        >
                          {skill.name}
                          {isMatched && ' ✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* CV Experience Section */}
                <div className="space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 inline-block">
                    Professional Experience
                  </h2>
                  {tailoredCv.experience?.map((exp, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-black">{exp.role}</span>
                        <span className="text-muted font-mono text-[11px]">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-body font-medium">
                        {exp.company} • {exp.location}
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-body pt-1">
                        {exp.achievements?.map((ach, aIdx) => (
                          <li key={aIdx} className="leading-relaxed">
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* CV Education */}
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 inline-block">
                    Education & Credentials
                  </h2>
                  {candidate.education?.map((edu, idx) => (
                    <div key={idx} className="text-xs flex justify-between">
                      <div>
                        <span className="font-bold text-black">{edu.degree}</span>
                        <p className="text-body">{edu.institution}</p>
                      </div>
                      <span className="text-muted font-mono text-[11px]">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ATS Checklist Grid */}
              <div className="p-4 rounded-lg bg-canvas-soft border border-hairline-strong">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-ink">
                      ATS Compliance Checklist
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-700">
                    {tailoredCv.atsScore}% Pass Rate
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {tailoredCv.atsChecklist?.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-body">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COVER LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-4">
              {/* Tone selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface-strong border border-hairline">
                <span className="text-xs font-semibold uppercase tracking-wider text-body-strong">
                  Cover Letter Tone:
                </span>
                <div className="flex items-center gap-1.5">
                  {['professional', 'friendly', 'concise'].map((toneKey) => (
                    <button
                      key={toneKey}
                      type="button"
                      onClick={() => handleToneChange(toneKey)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium capitalize transition-all ${
                        selectedTone === toneKey
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-card text-body hover:text-ink border border-hairline'
                      }`}
                    >
                      {toneKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Letter Editor */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-body-strong mb-1.5 block">
                  Generated Cover Letter (Editable)
                </label>
                <textarea
                  rows={14}
                  value={editableLetterContent}
                  onChange={(e) => setEditableLetterContent(e.target.value)}
                  className="w-full rounded-md border border-hairline-strong bg-surface-card p-4 font-sans text-sm text-ink leading-relaxed focus:border-ink focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Modal bottom application footer */}
          <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleOpenOriginalPosting}
              className="text-xs text-text-link hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Simulate: View Original Posting on {job.source}</span>
            </button>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-end">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                className="w-full sm:w-auto justify-center"
                onClick={handleMarkAsApplied}
                disabled={isSubmittingApp}
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Mark as Applied & Save</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
