import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { 
  FileText, 
  Mail, 
  Calendar, 
  Building2, 
  MapPin, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Printer,
  Download,
  Copy,
  Briefcase 
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications, updateApplicationStatus } = useAppState();
  const { showToast } = useToast();

  const [inspectingApp, setInspectingApp] = useState(null);
  const [inspectTab, setInspectTab] = useState('cv'); // 'cv' | 'letter'

  // Pipeline metrics
  const total = applications.length;
  const interviewing = applications.filter((a) => a.status === 'Interviewing').length;
  const offer = applications.filter((a) => a.status === 'Offer').length;
  const applied = applications.filter((a) => a.status === 'Applied').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus);
    showToast(`Application status updated to "${newStatus}"`, 'info');
  };

  const handleDownloadLetter = (app) => {
    const content = app.coverLetter?.content || '';
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${app.company.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Cover letter downloaded as .txt', 'info');
  };

  return (
    <div className="w-full bg-canvas py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Applications Tracker
            </h1>
            <p className="text-sm text-body">
              Monitor candidate pipeline status and retrieve stored tailored CVs & cover letters.
            </p>
          </div>

          <Link to="/matches">
            <Button size="sm" variant="primary">
              <span>Find More Matches</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Pipeline Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface-card border border-hairline-strong">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Total Applied
            </span>
            <div className="text-2xl font-mono font-bold text-ink mt-1">
              {total}
            </div>
          </Card>

          <Card className="p-4 bg-surface-card border border-hairline-strong">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
              In Review / Applied
            </span>
            <div className="text-2xl font-mono font-bold text-amber-800 mt-1">
              {applied}
            </div>
          </Card>

          <Card className="p-4 bg-surface-card border border-hairline-strong">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700">
              Interviewing
            </span>
            <div className="text-2xl font-mono font-bold text-purple-800 mt-1">
              {interviewing}
            </div>
          </Card>

          <Card className="p-4 bg-surface-card border border-hairline-strong">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Job Offers
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-800 mt-1">
              {offer}
            </div>
          </Card>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">
              Submitted Applications ({applications.length})
            </h2>

            <div className="space-y-3">
              {applications.map((app) => (
                <Card
                  key={app.id}
                  className="p-5 bg-surface-card border border-hairline-strong flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-body/40 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base text-ink truncate">
                        {app.jobTitle}
                      </h3>
                      <Badge variant="source" size="sm">{app.source || 'Wuzzuf'}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-body">
                      <span className="font-semibold text-body-strong">{app.company}</span>
                      <span>•</span>
                      <span>{app.location}</span>
                      <span>•</span>
                      <span className="font-mono text-muted">
                        Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown & Review Buttons */}
                  <div className="flex items-center gap-3 shrink-0">
                    
                    {/* Status dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted font-mono hidden sm:inline">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`h-9 px-3 rounded-md text-xs font-semibold cursor-pointer border focus:outline-none transition-colors ${
                          app.status === 'Offer'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : app.status === 'Interviewing'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : 'bg-surface-strong text-ink border-hairline-strong'
                        }`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* View Tailored Materials */}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setInspectingApp(app)}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      <span>View Docs</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Empty Applications State */
          <div className="p-16 rounded-xl border border-hairline-strong bg-surface-card text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center mx-auto text-muted">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">
                No applications submitted yet
              </h3>
              <p className="text-xs text-body">
                Explore your top matching jobs and apply in one click using your 4 free starter credits.
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

      {/* Inspect Application Materials Modal */}
      {inspectingApp && (
        <Modal
          isOpen={Boolean(inspectingApp)}
          onClose={() => setInspectingApp(null)}
          title={`Application Documents: ${inspectingApp.company}`}
          description={`Targeted for ${inspectingApp.jobTitle}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <Tabs
                activeTab={inspectTab}
                onChange={setInspectTab}
                tabs={[
                  { id: 'cv', label: 'Stored Tailored CV', icon: FileText },
                  { id: 'letter', label: 'Stored Cover Letter', icon: Mail },
                ]}
              />

              <div className="flex items-center gap-2">
                {inspectTab === 'cv' ? (
                  <Button size="sm" variant="primary" onClick={() => window.print()}>
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    <span>Print / PDF</span>
                  </Button>
                ) : (
                  <Button size="sm" variant="primary" onClick={() => handleDownloadLetter(inspectingApp)}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    <span>Download .txt</span>
                  </Button>
                )}
              </div>
            </div>

            {inspectTab === 'cv' ? (
              <div className="bg-canvas-soft border border-hairline-strong rounded-lg p-6 max-h-[440px] overflow-y-auto space-y-4 text-xs">
                <div className="border-b border-hairline pb-3">
                  <h3 className="font-bold text-base text-ink">{inspectingApp.tailoredCv?.candidateName}</h3>
                  <p className="text-body font-mono">{inspectingApp.tailoredCv?.headline}</p>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-ink mb-1">Tailored Summary</h4>
                  <p className="text-body leading-relaxed">{inspectingApp.tailoredCv?.summary}</p>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-ink mb-1">Prioritized Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingApp.tailoredCv?.skills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-hairline font-mono">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-card border border-hairline-strong rounded-lg p-5 max-h-[440px] overflow-y-auto">
                <pre className="font-sans text-xs text-ink leading-relaxed whitespace-pre-wrap">
                  {inspectingApp.coverLetter?.content}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-hairline">
              <Button variant="secondary" onClick={() => setInspectingApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
