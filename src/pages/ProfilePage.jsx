import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input, { Textarea } from '../components/ui/Input.jsx';
import Chip from '../components/ui/Chip.jsx';
import Badge from '../components/ui/Badge.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import skillsTaxonomy from '../data/skills.json' with { type: 'json' };
import { 
  User, 
  Plus, 
  Save, 
  RotateCcw, 
  Briefcase, 
  GraduationCap, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

export default function ProfilePage() {
  const { candidate, setCandidate, updateCandidate, resetDemo } = useAppState();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: candidate.name || '',
    headline: candidate.headline || '',
    role: candidate.role || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    location: candidate.location || '',
    yearsExperience: candidate.yearsExperience || 0,
    summary: candidate.summary || '',
    skills: candidate.skills || [],
  });

  const [newSkillText, setNewSkillText] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  // Add skill
  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const name = newSkillText.trim();
    if (formData.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillText('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { id: name.toLowerCase(), name, level: 'Intermediate' }],
    }));
    setNewSkillText('');
  };

  // Remove skill
  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index),
    }));
  };

  // Save changes
  const handleSave = () => {
    updateCandidate(formData);
    showToast('Profile saved and job matches updated!', 'success');
  };

  return (
    <div className="w-full bg-canvas py-8 md:py-12">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Candidate Profile
            </h1>
            <p className="text-sm text-body">
              Update your skills and background to calibrate Fitly's matching percentages.
            </p>
          </div>

          <Button variant="primary" className="w-full sm:w-auto justify-center" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save & Recalculate Matches</span>
          </Button>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 bg-surface-card border border-hairline-strong space-y-6">
            
            <h2 className="text-base font-semibold text-ink border-b border-hairline pb-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Target Title / Headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Location (City, Country)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <Input
                label="Years of Relevant Experience"
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
              />
            </div>

            <Textarea
              label="Professional Summary"
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              helperText="This summary is dynamically tailored by Fitly for each company application."
            />

            {/* Skills Section */}
            <div className="space-y-3 pt-3 border-t border-hairline">
              <label className="text-xs font-semibold uppercase tracking-wider text-body-strong flex items-center justify-between">
                <span>Verified Technical Skills ({formData.skills.length})</span>
                <span className="text-[11px] font-normal text-muted lowercase">
                  Click 'x' to remove
                </span>
              </label>

              <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-canvas-soft border border-hairline min-h-[50px]">
                {formData.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill.name}
                    onRemove={() => handleRemoveSkill(idx)}
                  />
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Type a new skill (e.g. Next.js, Docker, Kubernetes)..."
                  className="h-10 flex-1 rounded-md border border-hairline-strong bg-surface-card px-3 text-sm text-ink focus:border-ink focus:outline-none"
                />
                <Button size="sm" variant="secondary" onClick={handleAddSkill}>
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add Skill</span>
                </Button>
              </div>
            </div>

          </Card>

          {/* Stored Experience List Display */}
          <Card className="p-6 bg-surface-card border border-hairline-strong space-y-4">
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted" />
              <span>Work Experience ({candidate.experience?.length || 0})</span>
            </h2>

            <div className="space-y-3">
              {candidate.experience?.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-canvas-soft border border-hairline text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-ink">
                    <span>{exp.role}</span>
                    <span className="font-mono text-muted text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-body font-medium">{exp.company} • {exp.location}</p>
                  <ul className="list-disc pl-4 space-y-1 text-body pt-1">
                    {exp.achievements?.map((ach, aIdx) => (
                      <li key={aIdx} className="leading-relaxed">{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Danger Zone: Reset Demo */}
          <Card className="p-6 bg-red-50/40 border border-red-200/60 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-red-900">
                Reset Demo to Initial Factory State
              </h3>
              <p className="text-xs text-red-700">
                Wipes localStorage, clears applications, and resets credit balance back to 4 starter credits.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowResetModal(true)}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Demo</span>
            </Button>
          </Card>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo State?"
      >
        <div className="space-y-4">
          <p className="text-sm text-body">
            This will wipe your current application history, reset credits to 4, and restore the initial candidate state.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetDemo();
                setShowResetModal(false);
                showToast('Demo reset to initial 4 credits!', 'success');
              }}
            >
              Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
