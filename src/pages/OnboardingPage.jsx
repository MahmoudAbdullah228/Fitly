import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input, { Textarea } from '../components/ui/Input.jsx';
import Chip from '../components/ui/Chip.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAppState } from '../hooks/useAppState.js';
import { useToast } from '../components/ui/Toast.jsx';
import { parseCvOrUrl } from '../services/aiService.js';
import demoCandidates from '../data/candidates.json' with { type: 'json' };
import skillsTaxonomy from '../data/skills.json' with { type: 'json' };
import { 
  UploadCloud, 
  Linkedin, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  Check, 
  Plus, 
  Edit3,
  FileText,
  User,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setCandidate } = useAppState();
  const { showToast } = useToast();

  const [wizardStep, setWizardStep] = useState(1); // 1: Path Selection, 2: Simulated Extraction, 3: Profile Review
  const [selectedPath, setSelectedPath] = useState('sample'); // 'upload' | 'manual' | 'sample'

  // Path A state: File & LinkedIn
  const [uploadedFile, setUploadedFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Path B state: Manual entry
  const [manualName, setManualName] = useState('');
  const [manualHeadline, setManualHeadline] = useState('');
  const [manualBio, setManualBio] = useState('');
  const [manualSkills, setManualSkills] = useState([]);

  // Path C state: Selected sample profile
  const [selectedSampleId, setSelectedSampleId] = useState('c1'); // default Omar Tarek

  // Step 2 extraction state
  const [extractionState, setExtractionState] = useState({
    message: 'Initializing parser...',
    progress: 10,
  });

  // Step 3 Review state (editable profile)
  const [reviewProfile, setReviewProfile] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Handle Drag & Drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Start extraction based on chosen path
  const handleProceedToExtraction = async () => {
    setWizardStep(2);

    let chosenCandidate = null;

    if (selectedPath === 'sample') {
      chosenCandidate = demoCandidates.find((c) => c.id === selectedSampleId) || demoCandidates[0];
    } else if (selectedPath === 'manual') {
      chosenCandidate = {
        id: `manual-${Date.now()}`,
        name: manualName.trim() || 'Candidate',
        role: manualHeadline.trim() || 'Professional',
        headline: manualHeadline.trim() || 'Software Engineer',
        email: 'candidate@example.com',
        phone: '+20 100 000 0000',
        location: 'Cairo, Egypt',
        linkedinUrl: '',
        yearsExperience: 2,
        summary: manualBio.trim() || 'Motivated professional with hands-on technical skills and proven problem-solving track record.',
        skills: manualSkills.map((name) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, level: 'Intermediate' })),
        experience: [
          {
            company: 'Independent Projects',
            role: manualHeadline || 'Web Developer',
            location: 'Cairo',
            startDate: '2023',
            endDate: 'Present',
            current: true,
            description: manualBio || 'Developed responsive applications and integrated REST APIs.',
            achievements: [
              'Built web applications utilizing modern component frameworks.',
              'Designed clean, responsive interfaces with high accessibility.'
            ]
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            institution: 'Cairo University',
            year: '2020 - 2024',
            grade: 'Very Good'
          }
        ],
        projects: [],
        certifications: [],
        languages: [{ language: 'Arabic', proficiency: 'Native' }, { language: 'English', proficiency: 'Good' }]
      };
    }

    try {
      const parsed = await parseCvOrUrl(
        uploadedFile || linkedinUrl || 'Sample Profile',
        (p) => setExtractionState({ message: p.message, progress: p.progress }),
        chosenCandidate
      );

      setReviewProfile(parsed);
      setWizardStep(3);
      showToast('Data extracted successfully! Review and refine below.', 'info');
    } catch (err) {
      console.error(err);
      showToast('Error during parsing.', 'error');
      setWizardStep(1);
    }
  };

  // Add skill in Step 3
  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !reviewProfile) return;
    const skillName = newSkillInput.trim();
    if (reviewProfile.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      setNewSkillInput('');
      return;
    }
    setReviewProfile({
      ...reviewProfile,
      skills: [...reviewProfile.skills, { id: skillName.toLowerCase(), name: skillName, level: 'Intermediate' }],
    });
    setNewSkillInput('');
  };

  // Remove skill in Step 3
  const handleRemoveSkill = (skillIndex) => {
    if (!reviewProfile) return;
    setReviewProfile({
      ...reviewProfile,
      skills: reviewProfile.skills.filter((_, idx) => idx !== skillIndex),
    });
  };

  // Save profile and redirect to Matches
  const handleFinishOnboarding = () => {
    if (!reviewProfile) return;
    setCandidate(reviewProfile);
    showToast(`Profile updated for ${reviewProfile.name}! Matches recalculated.`, 'success');
    navigate('/matches');
  };

  return (
    <div className="w-full min-h-[85vh] bg-canvas py-12 md:py-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Step indicator header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-strong text-ink font-mono text-xs font-semibold uppercase tracking-wider">
            Step {wizardStep} of 3
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            {wizardStep === 1 && 'Choose How to Provide Your Background'}
            {wizardStep === 2 && 'AI Extracting Skills & Experience'}
            {wizardStep === 3 && 'Review & Customize Your Profile'}
          </h1>
          <p className="text-sm text-body max-w-lg mx-auto">
            {wizardStep === 1 && 'Fitly adapts to your existing resume, or lets you explore instantly with pre-built candidate profiles.'}
            {wizardStep === 2 && 'Our mock AI parser simulates document text extraction and skills taxonomy mapping.'}
            {wizardStep === 3 && 'Make sure your extracted details look right. You can add skills or edit any field before matching.'}
          </p>
        </div>

        {/* STEP 1: PATH SELECTION */}
        {wizardStep === 1 && (
          <div className="space-y-6">
            
            {/* Path Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-lg bg-surface-strong border border-hairline">
              <button
                type="button"
                onClick={() => setSelectedPath('sample')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  selectedPath === 'sample'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-body hover:text-ink'
                }`}
              >
                Sample Profile (Demo)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPath('upload')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  selectedPath === 'upload'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-body hover:text-ink'
                }`}
              >
                Upload CV / LinkedIn
              </button>
              <button
                type="button"
                onClick={() => setSelectedPath('manual')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                  selectedPath === 'manual'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-body hover:text-ink'
                }`}
              >
                No CV (Manual Entry)
              </button>
            </div>

            {/* PATH OPTION A: SAMPLE PROFILE PICKER (Ideal for Demo) */}
            {selectedPath === 'sample' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Recommended for Professor Presentation:</strong> Pick one of 4 complete demo candidates to see real Egyptian market matching.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {demoCandidates.filter((c) => c.id !== 'blank').map((cand) => {
                    const isSelected = selectedSampleId === cand.id;
                    return (
                      <Card
                        key={cand.id}
                        hover
                        onClick={() => setSelectedSampleId(cand.id)}
                        className={`p-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-2 border-black bg-white shadow-sm ring-1 ring-black/10'
                            : 'border border-hairline-strong bg-surface-card hover:bg-canvas-soft'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={cand.avatar}
                            alt={cand.name}
                            className="w-12 h-12 rounded-full border border-hairline object-cover shrink-0"
                          />
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-sm text-ink truncate">
                                {cand.name}
                              </h3>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-body font-medium truncate">
                              {cand.role}
                            </p>
                            <p className="text-[11px] text-muted font-mono">
                              {cand.yearsExperience} yrs exp • {cand.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-3 mt-3 border-t border-hairline">
                          {cand.skills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-strong text-body-strong font-mono"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PATH OPTION B: UPLOAD CV OR LINKEDIN */}
            {selectedPath === 'upload' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-hairline-strong rounded-xl p-8 text-center bg-canvas-soft hover:bg-white hover:border-ink transition-colors cursor-pointer space-y-3"
                  onClick={() => document.getElementById('cv-file-input')?.click()}
                >
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-surface-strong flex items-center justify-center mx-auto text-ink">
                    <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {uploadedFile ? uploadedFile.name : 'Click to upload or drag & drop your CV'}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      PDF, DOCX up to 10MB (Simulated client-side parsing)
                    </p>
                  </div>
                  {uploadedFile && (
                    <Badge variant="success" size="sm">
                      File Selected ({Math.round(uploadedFile.size / 1024)} KB)
                    </Badge>
                  )}
                </div>

                {/* Optional LinkedIn URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-body-strong flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                    <span>Or Provide LinkedIn Profile URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="h-11 w-full rounded-md border border-hairline-strong bg-surface-card px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* PATH OPTION C: MANUAL ENTRY (FOR USERS WITHOUT CV) */}
            {selectedPath === 'manual' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <Input
                  label="Full Name"
                  placeholder="e.g. Mostafa Ibrahim"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />

                <Input
                  label="Target Role / Headline"
                  placeholder="e.g. Junior Frontend Developer or Growth Marketer"
                  value={manualHeadline}
                  onChange={(e) => setManualHeadline(e.target.value)}
                />

                <Textarea
                  label="Short Self-Description / Background"
                  placeholder="Describe your practical projects, coursework, or work experience..."
                  value={manualBio}
                  onChange={(e) => setManualBio(e.target.value)}
                  rows={3}
                />

                {/* Manual skills picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-body-strong block">
                    Select Your Key Skills ({manualSkills.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-surface-strong/60 border border-hairline max-h-52 overflow-y-auto">
                    {skillsTaxonomy.skills.map((sk) => {
                      const isSelected = manualSkills.includes(sk.name);
                      return (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => {
                            setManualSkills((prev) =>
                              isSelected
                                ? prev.filter((s) => s !== sk.name)
                                : [...prev, sk.name]
                            );
                          }}
                          className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-white text-body hover:text-ink border border-hairline'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {sk.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Proceed CTA */}
            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <span className="text-xs text-muted font-mono">
                Simulated AI Parsing • Zero server uploads
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={handleProceedToExtraction}
              >
                <span>Extract & Continue</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED EXTRACTION PROGRESS */}
        {wizardStep === 2 && (
          <Card className="p-12 bg-surface-card border border-hairline-strong text-center space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-surface-strong border border-hairline flex items-center justify-center mx-auto relative">
              <Sparkles className="w-8 h-8 text-ink animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="font-semibold text-lg text-ink">
                Parsing Candidate Profile
              </h3>
              <p className="text-sm text-body min-h-[30px]">
                {extractionState.message}
              </p>
            </div>

            <div className="w-full max-w-xs bg-surface-strong h-2.5 rounded-full overflow-hidden mx-auto">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${extractionState.progress}%` }}
              />
            </div>
            <span className="font-mono text-xs text-muted block">
              {extractionState.progress}% complete
            </span>
          </Card>
        )}

        {/* STEP 3: EDITABLE PROFILE REVIEW */}
        {wizardStep === 3 && reviewProfile && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <Card className="p-6 sm:p-8 bg-surface-card border border-hairline-strong space-y-6">
              
              {/* Header Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={reviewProfile.name}
                  onChange={(e) =>
                    setReviewProfile({ ...reviewProfile, name: e.target.value })
                  }
                />
                <Input
                  label="Professional Headline"
                  value={reviewProfile.headline}
                  onChange={(e) =>
                    setReviewProfile({ ...reviewProfile, headline: e.target.value })
                  }
                />
                <Input
                  label="Email Address"
                  value={reviewProfile.email}
                  onChange={(e) =>
                    setReviewProfile({ ...reviewProfile, email: e.target.value })
                  }
                />
                <Input
                  label="Phone & Location"
                  value={`${reviewProfile.phone} • ${reviewProfile.location}`}
                  onChange={(e) => {
                    const parts = e.target.value.split('•');
                    setReviewProfile({
                      ...reviewProfile,
                      phone: parts[0]?.trim() || reviewProfile.phone,
                      location: parts[1]?.trim() || reviewProfile.location,
                    });
                  }}
                />
              </div>

              {/* Professional Summary */}
              <Textarea
                label="Summary / About You"
                rows={3}
                value={reviewProfile.summary}
                onChange={(e) =>
                  setReviewProfile({ ...reviewProfile, summary: e.target.value })
                }
              />

              {/* Skills Manager (Add & Remove Chips) */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-body-strong flex items-center justify-between">
                  <span>Verified Skills ({reviewProfile.skills.length})</span>
                  <span className="text-[11px] font-normal text-muted lowercase">
                    Click 'x' to remove, or add new skills below
                  </span>
                </label>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-canvas-soft border border-hairline min-h-[50px]">
                  {reviewProfile.skills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill.name}
                      onRemove={() => handleRemoveSkill(idx)}
                    />
                  ))}
                </div>

                {/* Add Skill Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Add a new skill (e.g. Next.js, Docker, SEO)..."
                    className="h-9 flex-1 rounded-md border border-hairline-strong bg-surface-card px-3 text-xs text-ink focus:border-ink focus:outline-none"
                  />
                  <Button size="sm" variant="secondary" onClick={handleAddSkill}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Skill</span>
                  </Button>
                </div>
              </div>

              {/* Experience summary list */}
              <div className="space-y-3 pt-2 border-t border-hairline">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-body-strong">
                  Extracted Work History ({reviewProfile.experience?.length || 0})
                </h3>
                <div className="space-y-3">
                  {reviewProfile.experience?.map((exp, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-surface-strong/60 border border-hairline text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-ink">
                        <span>{exp.role}</span>
                        <span className="font-mono text-muted text-[11px]">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-body font-medium">{exp.company} • {exp.location}</p>
                      <p className="text-body leading-relaxed pt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </Card>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                onClick={() => setWizardStep(1)}
              >
                Back to Selection
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinishOnboarding}
              >
                <span>Save & View My Top 10 Matches</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
