import React from 'react';
import { Link } from 'react-router-dom';
import HeroDeviceMockup from '../components/home/HeroDeviceMockup.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  FileText, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Briefcase,
  Zap,
  TrendingUp,
  ShieldCheck,
  Building,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  const workflowSteps = [
    {
      step: '01',
      title: 'Provide Your CV or Profile',
      desc: 'Upload your existing PDF CV, link your LinkedIn, or start fresh in minutes with our guided skills selector.',
    },
    {
      step: '02',
      title: 'AI Matches Your Top 10',
      desc: 'Our deterministic algorithm evaluates requirements across LinkedIn, Wuzzuf, and Indeed to surface roles you actually fit.',
    },
    {
      step: '03',
      title: 'One-Click Tailored Documents',
      desc: 'Generate an ATS-friendly single-column CV prioritizing matching keywords, plus a targeted cover letter tailored to the company.',
    },
    {
      step: '04',
      title: 'Apply With 3x More Interviews',
      desc: 'Stop spraying hundreds of generic resumes. Focus energy on applications where hiring managers are looking for your exact toolkit.',
    },
  ];

  const features = [
    {
      title: 'Deterministic Match Percentage',
      desc: 'No vague recommendations. Fitly breaks down required skill overlap, domain alignment, and experience fit into an explicit score.',
      icon: Target,
    },
    {
      title: 'Tailored ATS-Optimized CV',
      desc: 'Automatically reorder skills, mirror job description keywords, and emphasize relevant impact bullets for each company.',
      icon: FileText,
    },
    {
      title: 'Customized Cover Letters',
      desc: 'Most applicants skip cover letters and get discarded. Fitly generates compelling letters in Professional, Friendly, or Concise tones.',
      icon: Mail,
    },
    {
      title: 'MENA & Egyptian Job Boards',
      desc: 'Curated feeds aggregated across LinkedIn, Wuzzuf, Indeed, Bayt, and Forasna with transparent salary ranges in EGP.',
      icon: Building,
    },
  ];

  const comparisonRows = [
    {
      criterion: 'Application Strategy',
      blind: 'Spray & pray 100+ generic resumes',
      fitly: 'Targeted Top 10 high-probability matches',
    },
    {
      criterion: 'Match Score Clarity',
      blind: 'Zero feedback on why you were rejected',
      fitly: 'Clear percentage score with strengths & gaps',
    },
    {
      criterion: 'CV Customization',
      blind: 'Same static CV sent to every company',
      fitly: 'Single-click ATS tailoring per job listing',
    },
    {
      criterion: 'Cover Letter',
      blind: 'Skipped 90% of the time due to friction',
      fitly: 'Auto-generated in 3 personalized tones',
    },
    {
      criterion: 'Time per Application',
      blind: '45+ minutes manual writing or generic spam',
      fitly: '2 minutes with full document preview & edit',
    },
  ];

  const faqs = [
    {
      question: 'How does Fitly calculate my job match percentage?',
      answer:
        'Fitly uses a deterministic scoring model weighted across 4 key dimensions: required skills overlap (60%), nice-to-have skills (15%), title & domain similarity (15%), and experience level fit (10%). Skills are matched against an extensive taxonomy handling aliases (e.g. JS = JavaScript, React.js = React).',
    },
    {
      question: 'Why does Fitly generate both a tailored CV and a cover letter?',
      answer:
        'Data shows that over 80% of applicants skip cover letters, making candidates who submit personalized letters stand out immediately. Fitly pairs an ATS-clean CV mirroring the job keywords with a targeted letter addressing the hiring team.',
    },
    {
      question: 'How do credits work?',
      answer:
        'Every new user receives 4 free starter credits upon signup—enough for exactly 2 complete job applications (1 credit for CV tailoring + 1 credit for cover letter generation). You can top up with pay-as-you-go credit packs or subscribe to a monthly plan in Egyptian Pounds (EGP).',
    },
    {
      question: 'Are the generated CVs ATS-friendly?',
      answer:
        'Yes! Fitly enforces clean, single-column linear typography with standard section headers, no nested layout tables, and no unreadable graphic bars. You can preview, edit every word, and export directly via print-to-PDF.',
    },
    {
      question: 'Can I use Fitly if I have no existing CV?',
      answer:
        'Absolutely. In our onboarding flow, choose "I don’t have a CV" to type a brief self-description and select your skills. Fitly will build your foundational profile and find matching jobs immediately.',
    },
  ];

  return (
    <div className="w-full flex flex-col">
      
      {/* 1. SIGNATURE HERO BAND WITH SKY-BLUE GRADIENT WASH (Gradient ONLY appears here!) */}
      <section className="relative w-full pt-16 sm:pt-20 pb-20 md:pb-28 overflow-hidden bg-linear-to-b from-[#cfe7ff]/40 via-[#a8c8e8]/20 to-canvas">
        <div className="max-w-300 mx-auto px-4 sm:px-6 text-center space-y-6">

          {/* Main Headline (Display Mega per DESIGN.md: 64px 600 weight -1.92px tracking) */}
          <h1 className="text-4xl sm:text-5xl md:text-[64px] font-semibold tracking-[-1.92px] text-ink leading-[1.08] max-w-4xl mx-auto">
            Apply where you fit.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed">
            Stop applying blindly to dozens of dead-end listings. Fitly computes your exact match percentage, ranks your <strong>Top 10 jobs</strong>, and tailors your ATS CV and cover letter in one click.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/start" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center">
                <span>Get Started (4 Free Credits)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/matches" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center">
                Explore Demo Matches
              </Button>
            </Link>
          </div>

          {/* Signature Device Mockup Composite */}
          <HeroDeviceMockup />

        </div>
      </section>

      {/* 2. HOW IT WORKS (WORKFLOW STEPS) */}
      <section className="py-20 md:py-24 border-b border-hairline bg-canvas">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              How Fitly Works
            </h2>
            <p className="text-sm text-body">
              From uploading your CV to submitting tailored applications in under three minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <Card key={idx} className="p-6 bg-surface-card border border-hairline-strong space-y-3">
                <span className="font-mono text-xs font-bold text-muted uppercase">
                  Step {step.step}
                </span>
                <h3 className="text-base font-semibold text-ink leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-body leading-relaxed">
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHY FITLY FEATURE CARDS */}
      <section className="py-20 md:py-24 border-b border-hairline bg-canvas-soft">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              Intelligent Differentiation
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Why Egyptian Job Seekers Choose Fitly
            </h2>
            <p className="text-sm text-body">
              Built specifically to overcome the common pitfalls of mass online job applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} className="p-6 sm:p-8 bg-surface-card border border-hairline-strong flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-surface-strong border border-hairline flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-ink" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-ink">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-body leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. FITLY VS APPLYING BLINDLY (COMPARISON TABLE) */}
      <section className="py-20 md:py-24 border-b border-hairline bg-canvas">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              The Reality Check
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Fitly vs. Applying Blindly
            </h2>
            <p className="text-sm text-body">
              See why strategic AI matching outperforms volume resume blasting every time.
            </p>
          </div>

          {/* Mobile Comparison Cards (<md) */}
          <div className="md:hidden space-y-4">
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-hairline-strong bg-surface-card space-y-3 shadow-xs"
              >
                <div className="font-semibold text-sm text-ink pb-2 border-b border-hairline">
                  {row.criterion}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/60 text-red-950 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold uppercase tracking-wider text-[10px] text-red-800 mb-0.5">
                        Traditional Blind Applying
                      </span>
                      <span className="leading-relaxed">{row.blind}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold uppercase tracking-wider text-[10px] text-emerald-800 mb-0.5">
                        Fitly AI Matcher
                      </span>
                      <span className="font-medium leading-relaxed">{row.fitly}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Comparison Table (md:block) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-hairline-strong shadow-xs">
            <table className="w-full text-left border-collapse text-sm min-w-[620px]">
              <thead>
                <tr className="bg-canvas-soft border-b border-hairline-strong">
                  <th className="p-4 sm:p-5 font-semibold text-xs uppercase tracking-wider text-body-strong w-1/3">
                    Criterion
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-xs uppercase tracking-wider text-red-700 w-1/3">
                    Traditional Blind Applying
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50/50 w-1/3">
                    Fitly AI Matcher
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="hover:bg-canvas-soft/50 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-ink">
                      {row.criterion}
                    </td>
                    <td className="p-4 sm:p-5 text-body flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{row.blind}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-ink font-medium bg-emerald-50/20">
                      <div className="flex items-start gap-2 text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.fitly}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="py-20 md:py-24 border-b border-hairline bg-canvas-soft">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              Transparent EGP Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Simple Pay-as-You-Go or Subscription
            </h2>
            <p className="text-sm text-body">
              Every user starts with 4 free credits (2 full applications). Top up only when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Starter */}
            <Card className="p-6 bg-surface-card border border-hairline-strong flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Free Trial</span>
                <h3 className="text-xl font-bold text-ink">Starter Credits</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-ink">0</span>
                  <span className="text-xs font-mono text-muted">EGP</span>
                </div>
                <p className="text-xs text-body">
                  Included automatically for every new job seeker.
                </p>
                <ul className="text-xs text-body space-y-2 pt-2 border-t border-hairline">
                  <li className="flex items-center gap-2">✓ 4 AI Credits included</li>
                  <li className="flex items-center gap-2">✓ Exactly 2 full applications</li>
                  <li className="flex items-center gap-2">✓ ATS CV & cover letter</li>
                </ul>
              </div>
              <Link to="/start" className="pt-4">
                <Button variant="secondary" className="w-full">
                  Create Your Profile
                </Button>
              </Link>
            </Card>

            {/* Popular Credit Pack */}
            <Card className="p-6 bg-surface-card border-2 border-black flex flex-col justify-between space-y-4 relative overflow-visible shadow-md">
              <span className="absolute -top-3.5 right-6 z-20 px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Best Value Pack
              </span>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Pay As You Go</span>
                <h3 className="text-xl font-bold text-ink">Active Seeker</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-ink">399</span>
                  <span className="text-xs font-mono text-muted">EGP (one-time)</span>
                </div>
                <p className="text-xs text-body">
                  16 AI credits for 8 tailored applications.
                </p>
                <ul className="text-xs text-body space-y-2 pt-2 border-t border-hairline">
                  <li className="flex items-center gap-2">✓ 16 AI Credits (8 full apps)</li>
                  <li className="flex items-center gap-2">✓ Credits never expire</li>
                  <li className="flex items-center gap-2">✓ 3 Cover letter tone options</li>
                  <li className="flex items-center gap-2">✓ ATS checklist verification</li>
                </ul>
              </div>
              <Link to="/credits" className="pt-4">
                <Button variant="primary" className="w-full">
                  View Credit Packs
                </Button>
              </Link>
            </Card>

            {/* Pro Subscription (Featured Dark Inversion Surface) */}
            <Card variant="dark" className="p-6 bg-surface-dark text-on-dark flex flex-col justify-between space-y-4 border border-surface-dark-elevated shadow-lg">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Monthly Plan</span>
                <h3 className="text-xl font-bold text-white">Professional</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-white">599</span>
                  <span className="text-xs font-mono text-on-dark-soft">EGP / mo</span>
                </div>
                <p className="text-xs text-on-dark-soft">
                  36 credits / month for active interview seekers.
                </p>
                <ul className="text-xs text-on-dark-soft space-y-2 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">✓ 36 Credits / month (18 apps)</li>
                  <li className="flex items-center gap-2">✓ Priority generation speed</li>
                  <li className="flex items-center gap-2">✓ Full match breakdown & gaps</li>
                  <li className="flex items-center gap-2">✓ Applications pipeline tracker</li>
                </ul>
              </div>
              <Link to="/credits" className="pt-4">
                <Button variant="inverted" className="w-full">
                  Explore Subscriptions
                </Button>
              </Link>
            </Card>
          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-20 md:py-24 border-b border-hairline bg-canvas">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion items={faqs} />

        </div>
      </section>

      {/* 7. PRE-FOOTER CTA BAND (96px padding, display-lg headline) */}
      <section className="py-24 bg-canvas text-center">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-1.08px] text-ink leading-tight">
            Ready to find roles where you actually fit?
          </h2>
          <p className="text-base text-body leading-relaxed">
            Upload your CV or build your candidate profile in under 60 seconds. See your Top 10 ranked job matches immediately.
          </p>
          <div className="pt-2">
            <Link to="/start" className="inline-block w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center">
                <span>Start Demo with 4 Free Credits</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
