import skillsTaxonomy from '../data/skills.json' with { type: 'json' };
import templatesData from '../data/templates.json' with { type: 'json' };

/**
 * Utility helper to pause execution for simulated AI latency
 * @param {number} ms - Milliseconds to delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to normalize a skill string using skills.json taxonomy aliases
 * @param {string} skillName 
 * @returns {string} Normalized canonical skill name
 */
export function normalizeSkill(skillName) {
  if (!skillName || typeof skillName !== 'string') return '';
  const clean = skillName.trim().toLowerCase();

  for (const skill of skillsTaxonomy.skills) {
    if (skill.name.toLowerCase() === clean) return skill.name;
    if (skill.id.toLowerCase() === clean) return skill.name;
    if (skill.aliases && skill.aliases.some((alias) => alias.toLowerCase() === clean)) {
      return skill.name;
    }
  }

  // Fallback: capitalized original
  return skillName.trim();
}

/**
 * Check if a candidate possesses a given skill (accounting for aliases)
 * @param {Array<string|object>} candidateSkills 
 * @param {string} targetSkill 
 * @returns {boolean}
 */
export function candidateHasSkill(candidateSkills, targetSkill) {
  if (!candidateSkills || !targetSkill) return false;
  const targetNorm = normalizeSkill(targetSkill).toLowerCase();

  return candidateSkills.some((s) => {
    const sName = typeof s === 'string' ? s : s.name;
    return normalizeSkill(sName).toLowerCase() === targetNorm;
  });
}

/**
 * Calculate title and domain similarity between candidate and job
 * @param {string} candidateRole 
 * @param {string} candidateHeadline 
 * @param {string} jobTitle 
 * @returns {number} Score between 0 and 1
 */
function calculateTitleSimilarity(candidateRole = '', candidateHeadline = '', jobTitle = '') {
  const cWords = `${candidateRole} ${candidateHeadline}`.toLowerCase().split(/[\s,/-]+/);
  const jWords = jobTitle.toLowerCase().split(/[\s,/-]+/);

  const keyTechTerms = [
    'frontend', 'backend', 'full-stack', 'fullstack', 'react', 'node', 'mobile',
    'flutter', 'data', 'analyst', 'marketing', 'growth', 'seo', 'cloud', 'devops',
    'qa', 'designer', 'ui/ux', 'product', 'finance', 'engineer', 'developer'
  ];

  let matches = 0;
  let totalKeyWords = 0;

  for (const term of keyTechTerms) {
    const inJob = jWords.includes(term);
    if (inJob) {
      totalKeyWords++;
      if (cWords.includes(term)) {
        matches++;
      }
    }
  }

  if (totalKeyWords === 0) return 0.5;
  return matches / totalKeyWords;
}

/**
 * Calculate seniority / experience level fit
 * @param {number} candidateExpYears 
 * @param {number} jobMinExpYears 
 * @param {string} jobSeniority 
 * @returns {number} Score between 0 and 1
 */
function calculateExperienceFit(candidateExpYears = 0, jobMinExpYears = 0, jobSeniority = '') {
  const diff = candidateExpYears - jobMinExpYears;

  if (diff >= 0 && diff <= 2) {
    return 1.0; // Perfect fit
  } else if (diff > 2) {
    return 0.85; // Slightly overqualified
  } else if (diff === -1) {
    return 0.65; // Reach job (1 year off)
  } else {
    return Math.max(0.2, 1.0 - Math.abs(diff) * 0.25);
  }
}

/**
 * Deterministically calculate the match between a candidate profile and a job listing.
 * 
 * Algorithm weights:
 * - 60% Required skills overlap
 * - 15% Nice-to-have skills overlap
 * - 15% Title & domain similarity
 * - 10% Experience level fit
 * 
 * // TODO(real-ai): Replace deterministic calculation with real vector embeddings & LLM semantic matching
 * 
 * @param {object} candidate - Candidate profile
 * @param {object} job - Job listing object
 * @returns {object} Match analysis object
 */
export function calculateMatch(candidate, job) {
  if (!candidate || !job) {
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: [],
      strengths: [],
      gaps: [],
      summary: 'Insufficient data for complete match analysis.'
    };
  }

  const candidateSkills = candidate.skills || [];
  const requiredSkills = job.requiredSkills || [];
  const niceSkills = job.niceToHaveSkills || [];

  const matchedSkills = [];
  const missingSkills = [];

  // 1. Required skills evaluation (60% weight)
  requiredSkills.forEach((skill) => {
    if (candidateHasSkill(candidateSkills, skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const reqScore = requiredSkills.length > 0 
    ? matchedSkills.length / requiredSkills.length 
    : 0.35;

  // 2. Nice to have skills evaluation (15% weight)
  let matchedNiceCount = 0;
  niceSkills.forEach((skill) => {
    if (candidateHasSkill(candidateSkills, skill)) {
      matchedNiceCount++;
      if (!matchedSkills.includes(skill)) {
        matchedSkills.push(skill);
      }
    }
  });

  const niceScore = niceSkills.length > 0
    ? matchedNiceCount / niceSkills.length
    : 0.35;

  // 3. Title & domain similarity (15% weight)
  const titleScore = calculateTitleSimilarity(candidate.role, candidate.headline, job.title);

  // 4. Experience fit (10% weight)
  const expScore = calculateExperienceFit(candidate.yearsExperience, job.yearsExperienceMin, job.seniority);

  // Weighted total raw score (0 to 100)
  const rawScore = (reqScore * 60) + (niceScore * 15) + (titleScore * 15) + (expScore * 10);
  const finalScore = Math.min(98, Math.max(24, Math.round(rawScore)));

  // Derive contextual strengths and gaps
  const strengths = [];
  const gaps = [];

  if (matchedSkills.length >= 3) {
    strengths.push(`Core tech stack alignment (${matchedSkills.slice(0, 3).join(', ')})`);
  }
  if (candidate.yearsExperience >= job.yearsExperienceMin) {
    strengths.push(`Meets minimum experience threshold (${candidate.yearsExperience} yrs vs ${job.yearsExperienceMin} yrs required)`);
  }
  if (titleScore >= 0.7) {
    strengths.push(`Direct domain experience in ${job.title.split('(')[0].trim()}`);
  }
  if (strengths.length === 0) {
    strengths.push('Transferable foundation and demonstrated willingness to learn');
  }

  if (missingSkills.length > 0) {
    gaps.push(`Missing key required requirements: ${missingSkills.slice(0, 2).join(', ')}`);
  }
  if (candidate.yearsExperience < job.yearsExperienceMin) {
    gaps.push(`Candidate has ${candidate.yearsExperience} yrs exp; role seeks ${job.yearsExperienceMin}+ yrs`);
  }
  if (gaps.length === 0) {
    gaps.push('No critical technical gaps identified for this role');
  }

  const summary = finalScore >= 80
    ? `Strong match for ${job.company}. Your experience with ${matchedSkills.slice(0, 2).join(' and ')} directly fulfills their priority requirements.`
    : finalScore >= 60
    ? `Solid potential match for ${job.title}. Your core background aligns well, though building depth in ${missingSkills[0] || 'advanced tooling'} will boost competitive positioning.`
    : `Moderate fit. While you share foundational skills, this role specifically emphasizes ${missingSkills.slice(0, 2).join(' and ')}.`;

  return {
    score: finalScore,
    matchedSkills,
    missingSkills,
    strengths,
    gaps,
    summary,
  };
}

/**
 * Filter and rank jobs for a candidate profile.
 * 
 * @param {object} candidate - Candidate profile
 * @param {Array<object>} allJobs - List of all job listings
 * @param {number} limit - Number of top matches to return (default 10)
 * @returns {Array<object>} Jobs with match analysis attached, sorted by score descending
 */
export function getTopMatches(candidate, allJobs, limit = 10) {
  if (!allJobs || !Array.isArray(allJobs)) return [];

  const evaluated = allJobs.map((job) => {
    const matchAnalysis = calculateMatch(candidate, job);
    return {
      ...job,
      match: matchAnalysis,
      matchScore: matchAnalysis.score,
    };
  });

  // Sort descending by score, tie-breaking by newest posted
  evaluated.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.postedDaysAgo - b.postedDaysAgo;
  });

  return limit ? evaluated.slice(0, limit) : evaluated;
}

/**
 * Simulates CV or LinkedIn profile parsing with step-by-step progress callbacks.
 * 
 * // TODO(real-ai): Replace with call to document OCR and LLM parser endpoint
 * 
 * @param {File|string} source - Uploaded CV file or LinkedIn URL
 * @param {function} onProgress - Progress callback ({ step, message, progress })
 * @param {object} [fallbackCandidate] - Selected demo candidate if available
 * @returns {Promise<object>} Extracted profile object
 */
export async function parseCvOrUrl(source, onProgress, fallbackCandidate) {
  const steps = [
    { message: 'Reading document and extracting text layers...', progress: 20 },
    { message: 'Parsing work experience and company timelines...', progress: 45 },
    { message: 'Identifying verified technical skills and credentials...', progress: 70 },
    { message: 'Normalizing Egyptian market taxonomy...', progress: 90 },
    { message: 'Profile synthesis complete.', progress: 100 },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (onProgress) {
      onProgress({ step: i + 1, totalSteps: steps.length, message: s.message, progress: s.progress });
    }
    await delay(350 + Math.random() * 200);
  }

  // If a fallbackCandidate was chosen, return it as the parsed result
  if (fallbackCandidate) {
    return JSON.parse(JSON.stringify(fallbackCandidate));
  }

  // Otherwise synthesize a parsed profile based on filename or URL
  const isUrl = typeof source === 'string' && source.startsWith('http');
  const sourceName = isUrl ? 'LinkedIn Candidate' : (source?.name ? source.name.replace(/\.[^/.]+$/, '') : 'Candidate');

  return {
    id: `custom-${Date.now()}`,
    name: sourceName,
    role: 'Software Specialist',
    headline: 'Software Engineer | Web Development & Problem Solving',
    email: 'applicant@example.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt',
    linkedinUrl: isUrl ? source : '',
    yearsExperience: 2,
    summary: 'Proactive and detail-oriented technical professional with hands-on experience in web development, database management, and agile teamwork in Egyptian startups.',
    skills: [
      { id: 'javascript', name: 'JavaScript', level: 'Advanced' },
      { id: 'react', name: 'React', level: 'Intermediate' },
      { id: 'html-css', name: 'HTML5 / CSS3', level: 'Advanced' },
      { id: 'git', name: 'Git / GitHub', level: 'Intermediate' },
      { id: 'rest-api', name: 'RESTful APIs', level: 'Intermediate' }
    ],
    experience: [
      {
        company: 'Technology Solutions Hub',
        role: 'Web Developer',
        location: 'Cairo',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        description: 'Developed client web interfaces and integrated REST APIs.',
        achievements: [
          'Delivered 8 responsive customer web portals with zero downtime.',
          'Improved interface loading speed by 25% through asset optimization.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.Sc. in Computer Science',
        institution: 'Cairo University',
        year: '2019 - 2023',
        grade: 'Very Good'
      }
    ],
    projects: [
      {
        title: 'Responsive Web Application',
        description: 'Interactive single-page application built with modern component architecture.',
        techStack: ['JavaScript', 'HTML5', 'CSS3']
      }
    ],
    certifications: ['Front-End Fundamentals Certificate'],
    languages: [
      { language: 'Arabic', proficiency: 'Native' },
      { language: 'English', proficiency: 'Professional Working' }
    ]
  };
}

/**
 * Simulates tailored ATS-friendly CV generation for a specific job posting.
 * 
 * // TODO(real-ai): Replace with prompt to fine-tuned LLM tailoring engine
 * 
 * @param {object} candidate - Candidate profile
 * @param {object} job - Target job listing
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} Tailored CV object with diff highlights and ATS score
 */
export async function generateTailoredCv(candidate, job, onProgress) {
  const steps = [
    { message: `Analyzing requirements for ${job.title}...`, progress: 25 },
    { message: `Synthesizing targeted summary for ${job.company}...`, progress: 50 },
    { message: 'Optimizing experience bullets and prioritizing matched skills...', progress: 75 },
    { message: 'Running ATS keyword compliance check...', progress: 100 },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (onProgress) {
      onProgress({ step: i + 1, totalSteps: steps.length, message: s.message, progress: s.progress });
    }
    await delay(320 + Math.random() * 180);
  }

  const matchAnalysis = calculateMatch(candidate, job);
  const matchedSkillsList = matchAnalysis.matchedSkills.length > 0 
    ? matchAnalysis.matchedSkills 
    : ['core software design', 'web standards'];

  // Reorder skills so matched ones are at the top
  const prioritizedSkills = [...(candidate.skills || [])].sort((a, b) => {
    const aMatch = candidateHasSkill([a], job.requiredSkills?.[0] || '');
    const bMatch = candidateHasSkill([b], job.requiredSkills?.[0] || '');
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  // Tailor summary using template
  const matchedSummaryStr = matchedSkillsList.slice(0, 3).join(', ');
  const tailoredSummary = `Targeted ${job.title} applicant with demonstrated expertise in ${matchedSummaryStr}. Proven ability to design scalable systems, deliver under agile schedules, and optimize workflows for ${job.company}. Highly committed to code excellence and cross-functional collaboration.`;

  // Tailored experience bullets emphasizing matched responsibilities
  const tailoredExperience = (candidate.experience || []).map((exp, index) => {
    const customAchievements = [...(exp.achievements || [])];
    if (index === 0 && matchAnalysis.matchedSkills.length > 0) {
      customAchievements.unshift(
        `Applied ${matchAnalysis.matchedSkills[0]} and best industry practices to streamline delivery pipelines, boosting team velocity by 22%.`
      );
    }
    return {
      ...exp,
      achievements: customAchievements,
    };
  });

  // Calculate ATS keyword coverage
  const totalKeywords = (job.requiredSkills || []).length + (job.niceToHaveSkills || []).length;
  const matchedKeywords = matchAnalysis.matchedSkills.length;
  const atsScore = totalKeywords > 0 ? Math.min(99, Math.round((matchedKeywords / totalKeywords) * 100) + 15) : 88;

  const diffHighlights = [
    { type: 'modified', section: 'Professional Summary', description: `Rewritten to target ${job.title} at ${job.company}` },
    { type: 'reordered', section: 'Technical Skills', description: `Prioritized ${matchedSkillsList.slice(0, 2).join(' & ')} to match primary job filters` },
    { type: 'added', section: 'Work Experience', description: `Injected quantified impact bullet matching ${job.company}'s required tech stack` },
    { type: 'optimized', section: 'Layout & Format', description: 'Enforced ATS-clean single-column hierarchy (no tables or multi-column grids)' }
  ];

  return {
    candidateName: candidate.name,
    headline: `${job.title} | Candidate for ${job.company}`,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    linkedinUrl: candidate.linkedinUrl,
    summary: tailoredSummary,
    skills: prioritizedSkills,
    experience: tailoredExperience,
    education: candidate.education || [],
    projects: candidate.projects || [],
    certifications: candidate.certifications || [],
    languages: candidate.languages || [],
    atsScore,
    atsChecklist: templatesData.atsChecklist.map((item) => ({
      ...item,
      passed: true,
    })),
    diffHighlights,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Simulates generating a personalized cover letter in one of 3 selectable tones.
 * 
 * // TODO(real-ai): Replace with call to LLM drafting API
 * 
 * @param {object} candidate - Candidate profile
 * @param {object} job - Target job listing
 * @param {'professional'|'friendly'|'concise'} tone - Tone selector
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} Generated cover letter
 */
export async function generateCoverLetter(candidate, job, tone = 'professional', onProgress) {
  const steps = [
    { message: `Extracting ${job.company} culture and company tone...`, progress: 30 },
    { message: `Drafting ${tone} cover letter structure...`, progress: 70 },
    { message: 'Polishing personalization and candidate achievements...', progress: 100 },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (onProgress) {
      onProgress({ step: i + 1, totalSteps: steps.length, message: s.message, progress: s.progress });
    }
    await delay(250 + Math.random() * 150);
  }

  const matchAnalysis = calculateMatch(candidate, job);
  const matchedList = matchAnalysis.matchedSkills.length > 0 ? matchAnalysis.matchedSkills : ['software development', 'analytical problem-solving'];
  const topSkill = matchedList[0] || 'software architecture';
  const matchedSkillsSummary = matchedList.slice(0, 3).join(', ');

  const templateConfig = templatesData.coverLetterTemplates[tone] || templatesData.coverLetterTemplates.professional;

  let text = templateConfig.template
    .replaceAll('{company}', job.company)
    .replaceAll('{title}', job.title)
    .replaceAll('{industry}', job.companyId ? job.companyId.replace('-', ' ') : 'technology')
    .replaceAll('{matchedSkills}', matchedSkillsSummary)
    .replaceAll('{matchedSkillsSummary}', matchedSkillsSummary)
    .replaceAll('{topSkill}', topSkill)
    .replaceAll('{candidateName}', candidate.name)
    .replaceAll('{candidatePhone}', candidate.phone || '+20 100 000 0000')
    .replaceAll('{candidateEmail}', candidate.email || 'applicant@example.com')
    .replaceAll('{candidateLocation}', candidate.location || 'Cairo, Egypt')
    .replaceAll('{location}', job.location || 'Cairo');

  return {
    tone,
    toneName: templateConfig.name,
    toneDescription: templateConfig.toneDescription,
    content: text,
    generatedAt: new Date().toISOString(),
  };
}
